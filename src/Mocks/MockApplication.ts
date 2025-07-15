import { Sale } from "../APIs/Sale/index.js";
import {
    DirectShopfrontCallbacks,
    DirectShopfrontEvent,
    FromShopfront,
    FromShopfrontInternal,
    FromShopfrontReturns,
    isDirectShopfrontEvent,
    ListenableFromShopfrontEvent,
    RegisterChangedEvent,
    SellScreenActionMode,
    SellScreenSummaryMode,
    SoundEvents,
    ToShopfront,
} from "../ApplicationEvents.js";
import { BaseApplication, ShopfrontEmbeddedVerificationToken } from "../BaseApplication.js";
import { Bridge } from "../Bridge.js";
import { Serializable } from "../Common/Serializable.js";
import { BaseEmitableEvent } from "../EmitableEvents/BaseEmitableEvent.js";
import ActionEventRegistrar from "../Utilities/ActionEventRegistrar.js";
import { MockCurrentSale } from "./APIs/Sale/MockCurrentSale.js";
import { MockDatabase } from "./Database/MockDatabase.js";
import { MockBridge } from "./MockBridge.js";

interface AudioRequestOptions {
    hasPermission: boolean;
    forceError: boolean;
}

export class MockApplication extends BaseApplication {
    protected currentSale: MockCurrentSale | false = false;

    constructor(bridge: MockBridge) {
        super(bridge, new MockDatabase(bridge));

        this.bridge.addEventListener(this.handleEvent);
        this.addEventListener("REGISTER_CHANGED", this.handleLocationChanged);

        this.fireEvent.bind(this);

        // Fire a ready event immediately
        this.handleEvent("READY", {
            key     : "embedded-key",
            outlet  : "outlet-id",
            register: "register-id",
        }, "");
    }

    /**
     * @inheritDoc
     */
    public destroy(): void {
        this.bridge.destroy();
    }

    /**
     * Handles an application event
     */
    protected handleEvent = async (
        event: keyof FromShopfront | keyof FromShopfrontInternal,
        data: Record<string, unknown>,
        id: string
    ): Promise<void> => {
        if(event === "READY") {
            this.isReady  = true;
            this.key      = data.key as string;
            this.outlet   = data.outlet as string;
            this.register = data.register as string;

            data = {
                outlet  : data.outlet,
                register: data.register,
            };
        }

        if(event === "CALLBACK") {
            // Actions aren't implemented
            return;
        }

        if(event === "CYCLE_KEY") {
            // Not needed
            return;
        } else if(event === "LOCATION_CHANGED") {
            // Unregister all serialized listeners as they're no longer displayed
            ActionEventRegistrar.clear();

            return;
        } else if(
            event === "RESPONSE_CURRENT_SALE" ||
            event === "RESPONSE_DATABASE_REQUEST" ||
            event === "RESPONSE_LOCATION" ||
            event === "RESPONSE_OPTION" ||
            event === "RESPONSE_AUDIO_REQUEST" ||
            event === "RESPONSE_SECURE_KEY" ||
            event === "RESPONSE_CREATE_SALE"
        ) {
            // Handled elsewhere
            return;
        }

        await this.emit(event, data, id);
    };

    /**
     * Calls any registered listeners for the received event
     */
    protected async emit(
        event: ListenableFromShopfrontEvent | DirectShopfrontEvent,
        data: Record<string, unknown> | string = {},
        id: string
    ): Promise<void> {
        if(isDirectShopfrontEvent(event)) {
            const listeners = this.directListeners[event];

            if(typeof listeners === "undefined") {
                return this.bridge.sendMessage(ToShopfront.NOT_LISTENING_TO_EVENT);
            }

            const results = [];

            for(const e of listeners.values()) {
                results.push(e.emit(data));
            }

            await Promise.all(results);

            return;
        }

        const results: Array<Promise<FromShopfrontReturns[typeof event]>> = [];

        if(typeof this.listeners[event] === "undefined") {
            // Don't need to do anything here
            return;
        }

        if(this.listeners[event].size === 0) {
            // Don't need to do anything here
            return;
        }

        const bridge = this.bridge as unknown as Bridge;

        for(const e of this.listeners[event].values()) {
            results.push(e.emit(data, bridge));
        }

        await Promise.allSettled(results);

        // The responses have been removed as we don't currently need them
    }

    /**
     * @inheritDoc
     */
    public send(item: BaseEmitableEvent<unknown> | Serializable<unknown>): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    public download(file: string): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    public redirect(toLocation: string, externalRedirect = true): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    public load(): () => void {
        return () => undefined;
    }

    /**
     * @inheritDoc
     */
    protected handleEventCallback(data: { id?: string; data: unknown; }): void {
        /* empty */
    }

    /**
     * Updates the cached location data
     */
    protected handleLocationChanged = (data: RegisterChangedEvent): undefined => {
        this.register = data.register;
        this.outlet = data.outlet;
        this.user = data.user;
    };

    /**
     * @inheritDoc
     */
    public getAuthenticationKey(): string {
        return this.key;
    }

    /**
     * @inheritDoc
     */
    public async getCurrentSale(): Promise<MockCurrentSale | false> {
        if(!this.currentSale) {
            this.currentSale = new MockCurrentSale(this);
        }

        return this.currentSale;
    }

    /**
     * @inheritDoc
     */
    public async createSale(sale: Sale): Promise<{
        success: boolean;
        message?: string;
    }> {
        if(!sale.getRegister() && !this.register) {
            return {
                success: false,
                message: "Sale has not provided a register and Shopfront currently doesn't have a register selected.",
            };
        }

        if(!this.user) {
            return {
                success: false,
                message: "A sale cannot be created when there is no user logged in to Shopfront.",
            };
        }

        const payments = sale.getPayments();

        let totalPaid = 0;

        for(const payment of payments) {
            if(payment.getCashout()) {
                return {
                    success: false,
                    message: "Sale payment with cash out is currently unsupported " +
                        "through the Embedded Fulfilment API.",
                };
            }

            if(payment.getRounding()) {
                return {
                    success: false,
                    message: "Sale payment with rounding is currently unsupported " +
                        "through the Embedded Fulfilment API.",
                };
            }

            totalPaid += payment.getAmount();
        }

        // Round to 4 decimal places to keep consistent with POS
        const remaining = Math.round((sale.getSaleTotal() - totalPaid) * 1000) / 1000;

        if(remaining < 0) {
            return {
                success: false,
                message: "Total paid is greater than sale total.",
            };
        }

        return {
            success: true,
        };
    }

    /**
     * @inheritDoc
     */
    public async getLocation(options?: { globalMode: boolean; useRegister: boolean; }): Promise<{
        register: string | null;
        outlet: string | null;
        user: string | null;
    }> {
        if(options) {
            if(options.globalMode) {
                return {
                    register: null,
                    outlet  : null,
                    user    : "shopfront-user-id",
                };
            } else if(!options.useRegister) {
                return {
                    register: null,
                    outlet  : "shopfront-outlet-id",
                    user    : "shopfront-user-id",
                };
            }
        }

        return {
            register: "shopfront-register-id",
            outlet  : "shopfront-outlet-id",
            user    : "shopfront-user-id",
        };
    }

    /**
     * @inheritDoc
     */
    public printReceipt(content: string): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    public changeSellScreenActionMode(mode: SellScreenActionMode): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    public changeSellScreenSummaryMode(mode: SellScreenSummaryMode): void {
        /* empty */
    }

    /**
     * @inheritDoc
     */
    protected async sendAudioRequest(
        type: SoundEvents, data?: unknown, options?: AudioRequestOptions
    ): Promise<{ success: boolean; message?: string; }> {
        if(options) {
            if(!options.hasPermission) {
                return {
                    success: false,
                    message: "You do not have permission to play audio",
                };
            }

            if(options.forceError) {
                return {
                    success: false,
                    message: "An error occurred whilst trying to play the audio",
                };
            }
        }

        return {
            success: true,
        };
    }

    /**
     * @inheritDoc
     */
    public requestAudioPermission(options?: AudioRequestOptions): Promise<{ success: boolean; message?: string; }> {
        return this.sendAudioRequest(ToShopfront.AUDIO_REQUEST_PERMISSION, undefined, options);
    }

    /**
     * @inheritDoc
     */
    public audioPreload(url: string, options?: AudioRequestOptions): Promise<{ success: boolean; message?: string; }> {
        return this.sendAudioRequest(
            ToShopfront.AUDIO_PRELOAD,
            {
                url,
            },
            options
        );
    }

    /**
     * @inheritDoc
     */
    public audioPlay(url: string, options?: AudioRequestOptions): Promise<{ success: boolean; message?: string; }> {
        return this.sendAudioRequest(
            ToShopfront.AUDIO_PLAY,
            {
                url,
            },
            options
        );
    }

    /**
     * @inheritDoc
     */
    public async getOption<TValueType>(option: string, defaultValue: TValueType): Promise<TValueType> {
        return defaultValue;
    }

    /**
     * @inheritDoc
     */
    public getToken(returnTokenObject: true): Promise<ShopfrontEmbeddedVerificationToken>;
    /**
     * @inheritDoc
     */
    public getToken(returnTokenObject?: false): Promise<string>;
    /**
     * @inheritDoc
     */
    public async getToken(returnTokenObject?: boolean): Promise<string | ShopfrontEmbeddedVerificationToken> {
        if(returnTokenObject) {
            return {
                id  : "token-id",
                app : "app-id",
                auth: "embedded-token",
                user: "user-id",
                url : {
                    raw   : "https://testing.test",
                    loaded: "https://frame.url",
                },
            };
        }

        return "embedded-token";
    }

    /**
     * Mocks an event being fired from Shopfront
     */
    public async fireEvent<
        T extends ListenableFromShopfrontEvent,
        HasParams extends (Parameters<FromShopfront[T]["emit"]> extends [never] ? false : true),
    >(
        event: T,
        ...data: HasParams extends true ? Parameters<FromShopfront[T]["emit"]> : [undefined]
    ): Promise<void>;
    /**
     * Mocks an event being fired from Shopfront
     */
    public async fireEvent<
        D extends DirectShopfrontEvent,
        HasParams extends (Parameters<DirectShopfrontCallbacks[D]> extends [never] ? false : true),
    >(
        event: D,
        ...data: HasParams extends true ? Parameters<DirectShopfrontCallbacks[D]> : [undefined]
    ): Promise<void>;
    /**
     * Mocks an event being fired from Shopfront
     */
    public async fireEvent<
        T extends ListenableFromShopfrontEvent,
        D extends DirectShopfrontEvent,
        HasParams extends (D extends DirectShopfrontEvent ?
            Parameters<DirectShopfrontCallbacks[D]> extends [never] ? false : true :
            Parameters<FromShopfront[T]["emit"]> extends [never] ? false : true),
      >(
        event: T | D,
        ...data: HasParams extends true ?
            D extends DirectShopfrontEvent ?
                Parameters<DirectShopfrontCallbacks[D]> :
                Parameters<FromShopfront[T]["emit"]>
            : [undefined]
    ): Promise<void> {
        let params: Record<string, unknown> | string | undefined;

        if(data.length > 0) {
            if(typeof data[0] === "object") {
                params = {
                    ...data[0],
                };
            } else {
                params = data[0];
            }
            // We don't care about the Bridge param in FromShopfront events, as that is passed in by the `emit` method
            // Direct events do not pass in a second parameter
        }

        await this.emit(event, params, "");
    };
}
