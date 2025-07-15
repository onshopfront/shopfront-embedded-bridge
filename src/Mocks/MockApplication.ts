import { Sale } from "../APIs/Sale/index.js";
import { Application } from "../Application.js";
import {
    DirectShopfrontCallbacks,
    DirectShopfrontEvent,
    FromShopfront,
    FromShopfrontCallbacks,
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
import { AudioPermissionChange } from "../Events/AudioPermissionChange.js";
import { AudioReady } from "../Events/AudioReady.js";
import { BaseEvent } from "../Events/BaseEvent.js";
import { SaleAddCustomer } from "../Events/DirectEvents/SaleAddCustomer.js";
import { SaleAddProduct } from "../Events/DirectEvents/SaleAddProduct.js";
import { SaleChangeQuantity } from "../Events/DirectEvents/SaleChangeQuantity.js";
import { SaleClear } from "../Events/DirectEvents/SaleClear.js";
import { SaleRemoveCustomer } from "../Events/DirectEvents/SaleRemoveCustomer.js";
import { SaleRemoveProduct } from "../Events/DirectEvents/SaleRemoveProduct.js";
import { SaleUpdateProducts } from "../Events/DirectEvents/SaleUpdateProducts.js";
import { FormatIntegratedProduct } from "../Events/FormatIntegratedProduct.js";
import { FulfilmentCollectOrder } from "../Events/FulfilmentCollectOrder.js";
import { FulfilmentCompleteOrder } from "../Events/FulfilmentCompleteOrder.js";
import { FulfilmentGetOrder } from "../Events/FulfilmentGetOrder.js";
import { FulfilmentOrderApproval } from "../Events/FulfilmentOrderApproval.js";
import { FulfilmentProcessOrder } from "../Events/FulfilmentProcessOrder.js";
import { FulfilmentVoidOrder } from "../Events/FulfilmentVoidOrder.js";
import { GiftCardCodeCheck } from "../Events/GiftCardCodeCheck.js";
import { InternalPageMessage } from "../Events/InternalPageMessage.js";
import { PaymentMethodsEnabled } from "../Events/PaymentMethodsEnabled.js";
import { Ready } from "../Events/Ready.js";
import { RegisterChanged } from "../Events/RegisterChanged.js";
import { RequestButtons } from "../Events/RequestButtons.js";
import { RequestCustomerListOptions } from "../Events/RequestCustomerListOptions.js";
import { RequestSaleKeys } from "../Events/RequestSaleKeys.js";
import { RequestSellScreenOptions } from "../Events/RequestSellScreenOptions.js";
import { RequestSettings } from "../Events/RequestSettings.js";
import { RequestTableColumns } from "../Events/RequestTableColumns.js";
import { SaleComplete } from "../Events/SaleComplete.js";
import { UIPipeline } from "../Events/UIPipeline.js";
import ActionEventRegistrar from "../Utilities/ActionEventRegistrar.js";
import { AnyFunction, MaybePromise } from "../Utilities/MiscTypes.js";
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
    public addEventListener<E extends ListenableFromShopfrontEvent>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * @inheritDoc
     */
    public addEventListener<D extends DirectShopfrontEvent>(
        event: D,
        callback: DirectShopfrontCallbacks[D]
    ): void;
    /**
     * @inheritDoc
     */
    public addEventListener(
        event: ListenableFromShopfrontEvent | DirectShopfrontEvent,
        callback: AnyFunction
    ): void {
        if(isDirectShopfrontEvent(event)) {
            let c;

            switch(event) {
                case "SALE_ADD_PRODUCT":
                    c = new SaleAddProduct(callback);
                    this.directListeners[event].set(callback, c);

                    break;
                case "SALE_REMOVE_PRODUCT":
                    c = new SaleRemoveProduct(callback);
                    this.directListeners[event].set(callback, c);

                    break;
                case "SALE_CHANGE_QUANTITY":
                    c = new SaleChangeQuantity(callback);
                    this.directListeners[event].set(callback, c);

                    break;
                case "SALE_UPDATE_PRODUCTS":
                    c = new SaleUpdateProducts(callback);
                    this.directListeners[event].set(callback, c);

                    break;
                case "SALE_ADD_CUSTOMER":
                    c = new SaleAddCustomer(callback);
                    this.directListeners[event].set(callback, c);

                    break;
                case "SALE_REMOVE_CUSTOMER":
                    c = new SaleRemoveCustomer(callback);
                    this.directListeners[event].set(callback, c);

                    break;
                case "SALE_CLEAR":
                    c = new SaleClear(callback);
                    this.directListeners[event].set(callback, c);

                    break;
            }

            if(typeof c === "undefined") {
                throw new TypeError(`${event} has not been defined`);
            }

            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let c: BaseEvent<any, any, any, any, any> | undefined;

        switch(event) {
            case "READY":
                c = new Ready(callback as FromShopfrontCallbacks["READY"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_SETTINGS":
                c = new RequestSettings(callback as FromShopfrontCallbacks["REQUEST_SETTINGS"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_BUTTONS":
                c = new RequestButtons(callback as FromShopfrontCallbacks["REQUEST_BUTTONS"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_TABLE_COLUMNS":
                c = new RequestTableColumns(callback as FromShopfrontCallbacks["REQUEST_TABLE_COLUMNS"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_SELL_SCREEN_OPTIONS":
                c = new RequestSellScreenOptions(callback as FromShopfrontCallbacks["REQUEST_SELL_SCREEN_OPTIONS"]);
                this.listeners[event].set(callback, c);
                break;
            case "INTERNAL_PAGE_MESSAGE":
                c = new InternalPageMessage(
                    callback as FromShopfrontCallbacks["INTERNAL_PAGE_MESSAGE"],
                    this as unknown as Application
                );
                this.listeners[event].set(callback, c as InternalPageMessage);
                break;
            case "REGISTER_CHANGED":
                c = new RegisterChanged(callback as FromShopfrontCallbacks["REGISTER_CHANGED"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_CUSTOMER_LIST_OPTIONS":
                c = new RequestCustomerListOptions(callback as FromShopfrontCallbacks["REQUEST_CUSTOMER_LIST_OPTIONS"]);
                this.listeners[event].set(callback, c);
                break;
            case "FORMAT_INTEGRATED_PRODUCT":
                c = new FormatIntegratedProduct(callback as FromShopfrontCallbacks["FORMAT_INTEGRATED_PRODUCT"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_SALE_KEYS":
                c = new RequestSaleKeys(callback as FromShopfrontCallbacks["REQUEST_SALE_KEYS"]);
                this.listeners[event].set(callback, c as RequestSaleKeys);
                break;
            case "SALE_COMPLETE":
                c = new SaleComplete(callback as FromShopfrontCallbacks["SALE_COMPLETE"]);
                this.listeners[event].set(callback, c);
                break;
            case "UI_PIPELINE":
                c = new UIPipeline(callback as FromShopfrontCallbacks["UI_PIPELINE"]);
                this.listeners[event].set(callback, c);
                break;
            case "PAYMENT_METHODS_ENABLED":
                c = new PaymentMethodsEnabled(callback as FromShopfrontCallbacks["PAYMENT_METHODS_ENABLED"]);
                this.listeners[event].set(callback, c);
                break;
            case "AUDIO_READY":
                c = new AudioReady(callback as FromShopfrontCallbacks["AUDIO_READY"]);
                this.listeners[event].set(callback, c as AudioReady);
                break;
            case "AUDIO_PERMISSION_CHANGE":
                c = new AudioPermissionChange(callback as FromShopfrontCallbacks["AUDIO_PERMISSION_CHANGE"]);
                this.listeners[event].set(callback, c);
                break;
            case "FULFILMENT_GET_ORDER":
                if(this.listeners[event].size !== 0) {
                    throw new TypeError("Application already has 'FULFILMENT_GET_ORDER' event listener registered.");
                }

                c = new FulfilmentGetOrder(callback as FromShopfrontCallbacks["FULFILMENT_GET_ORDER"]);
                this.listeners[event].set(callback, c);
                break;
            case "FULFILMENT_VOID_ORDER":
                c = new FulfilmentVoidOrder(callback as FromShopfrontCallbacks["FULFILMENT_VOID_ORDER"]);
                this.listeners[event].set(callback, c);
                break;
            case "FULFILMENT_PROCESS_ORDER":
                c = new FulfilmentProcessOrder(callback as FromShopfrontCallbacks["FULFILMENT_PROCESS_ORDER"]);
                this.listeners[event].set(callback, c);
                break;
            case "FULFILMENT_ORDER_APPROVAL":
                c = new FulfilmentOrderApproval(callback as FromShopfrontCallbacks["FULFILMENT_ORDER_APPROVAL"]);
                this.listeners[event].set(callback, c);
                break;
            case "FULFILMENT_ORDER_COLLECTED":
                c = new FulfilmentCollectOrder(callback as FromShopfrontCallbacks["FULFILMENT_ORDER_COLLECTED"]);
                this.listeners[event].set(callback, c);
                break;
            case "FULFILMENT_ORDER_COMPLETED":
                c = new FulfilmentCompleteOrder(callback as FromShopfrontCallbacks["FULFILMENT_ORDER_COMPLETED"]);
                this.listeners[event].set(callback, c);
                break;
            case "GIFT_CARD_CODE_CHECK":
                c = new GiftCardCodeCheck(callback as FromShopfrontCallbacks["GIFT_CARD_CODE_CHECK"]);
                this.listeners[event].set(callback, c);
                break;
        }

        if(typeof c === "undefined") {
            throw new TypeError(`${event} has not been defined`);
        }

        if(event === "READY" && this.isReady) {
            c = c as Ready;
            c.emit({
                outlet  : this.outlet,
                register: this.register,
                user    : this.user,
            });
        }
    }

    /**
     * @inheritDoc
     */
    public removeEventListener<E extends ListenableFromShopfrontEvent>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * @inheritDoc
     */
    public removeEventListener<D extends DirectShopfrontEvent>(
        event: D,
        callback: DirectShopfrontCallbacks[D]
    ): void;
    /**
     * @inheritDoc
     */
    public removeEventListener(
        event: ListenableFromShopfrontEvent | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => MaybePromise<void>
    ): void {
        if(isDirectShopfrontEvent(event)) {
            this.directListeners[event].delete(callback);

            return;
        }

        this.listeners[event].delete(callback);
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
            // We don't care about the Bridge parameter, as that is passed in by the `emit` method
        }

        await this.emit(event, params, "");
    };
}
