import { Button } from "./Actions/Button.js";
import { Database } from "./APIs/Database/Database.js";
import { CurrentSale } from "./APIs/Sale/CurrentSale.js";
import { Sale, ShopfrontSaleState } from "./APIs/Sale/index.js";
import {
    DirectShopfrontEvent,
    DirectShopfrontEventCallback,
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontInternal,
    FromShopfrontReturns,
    isDirectShopfrontEvent,
    ListenableFromShopfrontEvents,
    RegisterChangedEvent,
    SellScreenActionMode,
    SellScreenSummaryMode,
    SoundEvents,
    ToShopfront,
} from "./ApplicationEvents.js";
import {
    BaseApplication,
    ShopfrontEmbeddedTokenError,
    ShopfrontEmbeddedVerificationToken,
    ShopfrontResponse,
    ShopfrontTokenDecodingError,
    ShopfrontTokenRequestError,
} from "./BaseApplication.js";
import { ApplicationEventListener, Bridge } from "./Bridge.js";
import { Serializable } from "./Common/Serializable.js";
import { BaseEmitableEvent } from "./EmitableEvents/BaseEmitableEvent.js";
import { AudioPermissionChange } from "./Events/AudioPermissionChange.js";
import { AudioReady } from "./Events/AudioReady.js";
import { BaseEvent } from "./Events/BaseEvent.js";
import { FormatIntegratedProduct } from "./Events/FormatIntegratedProduct.js";
import { FulfilmentCollectOrder } from "./Events/FulfilmentCollectOrder.js";
import { FulfilmentCompleteOrder } from "./Events/FulfilmentCompleteOrder.js";
import { FulfilmentGetOrder } from "./Events/FulfilmentGetOrder.js";
import { FulfilmentOrderApproval } from "./Events/FulfilmentOrderApproval.js";
import { FulfilmentProcessOrder } from "./Events/FulfilmentProcessOrder.js";
import { FulfilmentVoidOrder } from "./Events/FulfilmentVoidOrder.js";
import { GiftCardCodeCheck } from "./Events/GiftCardCodeCheck.js";
import { InternalPageMessage } from "./Events/InternalPageMessage.js";
import { PaymentMethodsEnabled } from "./Events/PaymentMethodsEnabled.js";
import { Ready } from "./Events/Ready.js";
import { RegisterChanged } from "./Events/RegisterChanged.js";
import { RequestButtons } from "./Events/RequestButtons.js";
import { RequestCustomerListOptions } from "./Events/RequestCustomerListOptions.js";
import { RequestSaleKeys } from "./Events/RequestSaleKeys.js";
import { RequestSellScreenOptions } from "./Events/RequestSellScreenOptions.js";
import { RequestSettings } from "./Events/RequestSettings.js";
import { RequestTableColumns } from "./Events/RequestTableColumns.js";
import { SaleComplete } from "./Events/SaleComplete.js";
import { UIPipeline } from "./Events/UIPipeline.js";
import ActionEventRegistrar from "./Utilities/ActionEventRegistrar.js";
import { MaybePromise } from "./Utilities/MiscTypes.js";
import { buildSaleData } from "./Utilities/SaleCreate.js";

export class Application extends BaseApplication<Bridge> {
    constructor(bridge: Bridge) {
        super(bridge, new Database(bridge));

        this.bridge.addEventListener(this.handleEvent);
        this.addEventListener("REGISTER_CHANGED", this.handleLocationChanged);
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
    protected handleEvent = (
        event: keyof FromShopfront | keyof FromShopfrontInternal,
        data: Record<string, unknown>,
        id: string
    ): void => {
        if(event === "READY") {
            this.isReady = true;
            this.key     = data.key as string;
            this.outlet  = data.outlet as string;
            this.register = data.register as string;

            data = {
                outlet  : data.outlet,
                register: data.register,
            };
        }

        if(event === "CALLBACK") {
            this.handleEventCallback(data as { id?: string; data: unknown; });

            return;
        }

        if(event === "CYCLE_KEY") {
            if(typeof data !== "object" || data === null) {
                return;
            }

            this.key = data.key as string;

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

        this.emit(event, data, id);
    };

    /**
     * Calls any registered listeners for the received event
     */
    protected emit(
        event: ListenableFromShopfrontEvents | DirectShopfrontEvent,
        data: Record<string, unknown> = {},
        id: string
    ): MaybePromise<void> {
        if(isDirectShopfrontEvent(event)) {
            const listeners = this.directListeners[event];

            if(typeof listeners === "undefined") {
                return this.bridge.sendMessage(ToShopfront.NOT_LISTENING_TO_EVENT);
            }

            const results = [];

            for(const e of listeners.values()) {
                results.push(e());
            }

            return Promise.all(results)
                .then(() => {
                    // Ensure void is returned
                });
        }

        let results = [];

        if(typeof this.listeners[event] === "undefined") {
            return this.bridge.sendMessage(ToShopfront.UNSUPPORTED_EVENT, event, id);
        }

        if(this.listeners[event].size === 0) {
            return this.bridge.sendMessage(ToShopfront.NOT_LISTENING_TO_EVENT, event, id);
        }

        for(const e of this.listeners[event].values()) {
            results.push(e.emit(data, this.bridge) as Promise<FromShopfrontReturns[typeof event]>);
        }

        // Respond if necessary
        switch(event) {
            case "REQUEST_BUTTONS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_BUTTONS"]>>;

                return Promise.all(results)
                    .then((res: Array<Array<Button>>) => {
                        return RequestButtons.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_SETTINGS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_SETTINGS"]>) => {
                        return RequestSettings.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_TABLE_COLUMNS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>) => {
                        return RequestTableColumns.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_SELL_SCREEN_OPTIONS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>) => {
                        return RequestSellScreenOptions.respond(this.bridge, res.flat(), id);
                    });
            case "FORMAT_INTEGRATED_PRODUCT":
                results = results as Array<Promise<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>) => {
                        return FormatIntegratedProduct.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_CUSTOMER_LIST_OPTIONS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]>>;

                return Promise.all(results)
                    .then(res => RequestCustomerListOptions.respond(this.bridge, res.flat(), id));
            case "REQUEST_SALE_KEYS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_SALE_KEYS"]>>;

                return Promise.all(results)
                    .then(res => RequestSaleKeys.respond(this.bridge, res.flat(), id));
            case "UI_PIPELINE":
                results = results as Array<Promise<FromShopfrontReturns["UI_PIPELINE"]>>;

                return Promise.all(results)
                    .then(res => {
                        return UIPipeline.respond(this.bridge, res.flat(), id);
                    });
            case "GIFT_CARD_CODE_CHECK":
                results = results as Array<Promise<FromShopfrontReturns["GIFT_CARD_CODE_CHECK"]>>;

                return Promise.all(results)
                    .then(res => {
                        return GiftCardCodeCheck.respond(this.bridge, res[0], id);
                    });
            case "PAYMENT_METHODS_ENABLED":
                results = results as Array<Promise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]>>;

                return Promise.all(results)
                    .then(res => {
                        return PaymentMethodsEnabled.respond(this.bridge, res.flat(), id);
                    });
            case "FULFILMENT_GET_ORDER":
                results = results as Array<Promise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>>;

                return Promise.all(results)
                    .then(res => {
                        return FulfilmentGetOrder.respond(this.bridge, res[0], id);
                    });
        }
    }

    /**
     * @inheritDoc
     */
    public addEventListener<E extends ListenableFromShopfrontEvents>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * @inheritDoc
     */
    public addEventListener(
        event: DirectShopfrontEvent,
        callback: DirectShopfrontEventCallback
    ): void;
    /**
     * @inheritDoc
     */
    public addEventListener(
        event: ListenableFromShopfrontEvents | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => void
    ): void {
        if(isDirectShopfrontEvent(event)) {
            if(typeof this.directListeners[event] === "undefined") {
                this.directListeners[event] = new Set();
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.directListeners[event]!.add(callback);

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
                c = new InternalPageMessage(callback as FromShopfrontCallbacks["INTERNAL_PAGE_MESSAGE"], this);
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
    public removeEventListener<E extends keyof FromShopfrontCallbacks>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * @inheritDoc
     */
    public removeEventListener<D>(
        event: DirectShopfrontEvent,
        callback: (event: D) => MaybePromise<void>
    ): void;
    /**
     * @inheritDoc
     */
    public removeEventListener(
        event: ListenableFromShopfrontEvents | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => MaybePromise<void>
    ): void {
        if(isDirectShopfrontEvent(event)) {
            this.directListeners[event]?.delete(callback);

            return;
        }

        this.listeners[event].delete(callback);
    }

    /**
     * @inheritDoc
     */
    public send(item: BaseEmitableEvent<unknown> | Serializable<unknown>): void {
        if(item instanceof Button) {
            throw new TypeError("You cannot send Buttons to Shopfront without Shopfront requesting them");
        }

        if(item instanceof BaseEmitableEvent) {
            this.bridge.sendMessage(item.getEvent(), item.getData());
        } else {
            const serialized = item.serialize();

            this.bridge.sendMessage(ToShopfront.SERIALIZED, serialized);
        }
    }

    /**
     * @inheritDoc
     */
    public download(file: string): void {
        this.bridge.sendMessage(ToShopfront.DOWNLOAD, file);
    }

    /**
     * @inheritDoc
     */
    public redirect(toLocation: string, externalRedirect = true): void {
        this.bridge.sendMessage(ToShopfront.REDIRECT, {
            to      : toLocation,
            external: externalRedirect,
        });
    }

    /**
     * @inheritDoc
     */
    public load(): () => void {
        this.bridge.sendMessage(ToShopfront.LOAD, true);

        return () => this.bridge.sendMessage(ToShopfront.LOAD, false);
    }

    /**
     * Handles an event callback via the `ActionEventRegistrar`
     */
    protected handleEventCallback(data: { id?: string; data: unknown; }): void {
        if(typeof data.id === "undefined") {
            return;
        }

        const id = data.id;

        ActionEventRegistrar.fire(id, data.data);
    }

    /**
     * Updates the cached location data
     */
    protected handleLocationChanged(data: RegisterChangedEvent): undefined {
        this.register = data.register;
        this.outlet = data.outlet;
        this.user = data.user;
    }

    /**
     * @inheritDoc
     */
    public getAuthenticationKey(): string {
        return this.key;
    }

    /**
     * Checks whether `data` is formatted as a sale event
     */
    protected dataIsSaleEvent(data: Record<string, unknown>): data is {
        requestId: string;
        saleState: ShopfrontSaleState | false;
    } {
        return typeof data.requestId === "string" && (data.saleState === false || typeof data.saleState === "object");
    }

    /**
     * @inheritDoc
     */
    public async getCurrentSale(): Promise<CurrentSale | false> {
        const saleRequest = `SaleRequest-${Date.now().toString()}`;

        const promise = new Promise<ShopfrontSaleState | false>(res => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener = (
                event: keyof FromShopfrontInternal | keyof FromShopfront,
                data: Record<string, unknown>
            ) => {
                if(event !== "RESPONSE_CURRENT_SALE") {
                    return;
                }

                if(!this.dataIsSaleEvent(data)) {
                    return;
                }

                if(data.requestId !== saleRequest) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res(data.saleState);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.REQUEST_CURRENT_SALE, {
            requestId: saleRequest,
        });

        const saleState = await promise;

        if(saleState === false) {
            return saleState;
        }

        return new CurrentSale(this, saleState);
    }

    /**
     * Checks whether `data` is formatted as response data from a 'create sale' request
     */
    protected dataIsCreateEvent(data: Record<string, unknown>): data is {
        requestId: string;
        success: boolean;
        message?: string;
    } {
        return typeof data.requestId === "string" &&
            typeof data.success === "boolean" &&
            (
                typeof data.message === "undefined" || typeof data.message === "string"
            );
    }

    /**
     * @inheritDoc
     */
    public async createSale(sale: Sale): Promise<{
        success: boolean;
        message?: string;
    }> {
        const createSaleRequest = `CreateSaleRequest-${Date.now().toString()}`;

        const promise = new Promise<{
            success: boolean;
            message?: string;
        }>(res => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener = (
                event: keyof FromShopfrontInternal | keyof FromShopfront,
                data: Record<string, unknown>
            ) => {
                if(event !== "RESPONSE_CREATE_SALE") {
                    return;
                }

                if(!this.dataIsCreateEvent(data)) {
                    return;
                }

                if(data.requestId !== createSaleRequest) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res({
                    success: data.success,
                    message: data.message,
                });
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.CREATE_SALE, {
            requestId: createSaleRequest,
            sale     : buildSaleData(sale),
        });

        return promise;
    }

    /**
     * Checks whether `data` is formatted as location data
     */
    protected dataIsLocation(data: Record<string, unknown>): data is {
        requestId: string;
        register: string | null;
        outlet: string | null;
        user: string | null;
    } {
        return typeof data.requestId === "string" &&
            (typeof data.register === "string" || data.register === null) &&
            (typeof data.outlet === "string" || data.outlet === null) &&
            (typeof data.user === "string" || data.user === null);
    }

    /**
     * @inheritDoc
     */
    public async getLocation(): Promise<{
        register: string | null;
        outlet: string | null;
        user: string | null;
    }> {
        const locationRequest = `LocationRequest-${Date.now().toString()}`;

        const promise = new Promise<{
            register: string | null;
            outlet: string | null;
            user: string | null;
        }>(res => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener = (
                event: keyof FromShopfrontInternal | keyof FromShopfront,
                data: Record<string, unknown>
            ) => {
                if(event !== "RESPONSE_LOCATION") {
                    return;
                }

                if(!this.dataIsLocation(data)) {
                    return;
                }

                if(data.requestId !== locationRequest) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res(data);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.REQUEST_LOCATION, {
            requestId: locationRequest,
        });

        const location = await promise;

        return {
            register: location.register,
            outlet  : location.outlet,
            user    : location.user,
        };
    }

    /**
     * @inheritDoc
     */
    public printReceipt(content: string): void {
        this.bridge.sendMessage(ToShopfront.PRINT_RECEIPT, {
            content,
            type: "text",
        });
    }

    /**
     * @inheritDoc
     */
    public changeSellScreenActionMode(mode: SellScreenActionMode): void {
        this.bridge.sendMessage(ToShopfront.CHANGE_SELL_SCREEN_ACTION_MODE, {
            mode,
        });
    }

    /**
     * @inheritDoc
     */
    public changeSellScreenSummaryMode(mode: SellScreenSummaryMode): void {
        this.bridge.sendMessage(ToShopfront.CHANGE_SELL_SCREEN_SUMMARY_MODE, {
            mode,
        });
    }

    /**
     * Checks whether `data` is formatted as an audio response
     */
    protected dataIsAudioResponse(data: Record<string, unknown>): data is {
        requestId: string;
        success: boolean;
        message?: string;
    } {
        return typeof data.requestId === "string" &&
            typeof data.success === "boolean" &&
            (
                typeof data.message === "string" ||
                typeof data.message === "undefined"
            );
    }

    /**
     * Sends an audio request to Shopfront
     */
    protected sendAudioRequest(type: SoundEvents, data?: unknown): Promise<ShopfrontResponse> {
        const request = `AudioRequest-${type}-${Date.now().toString()}`;

        const promise = new Promise<ShopfrontResponse>(res => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener = (
                event: keyof FromShopfrontInternal | keyof FromShopfront,
                data: Record<string, unknown>
            ) => {
                if(event !== "RESPONSE_AUDIO_REQUEST") {
                    return;
                }

                if(!this.dataIsAudioResponse(data)) {
                    return;
                }

                if(data.requestId !== request) {
                    return;
                }

                this.bridge.removeEventListener(listener);

                res({
                    success: data.success,
                    message: data.message,
                });
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(type, {
            requestId: request,
            data,
        });

        return promise;
    }

    /**
     * @inheritDoc
     */
    public requestAudioPermission(): Promise<ShopfrontResponse> {
        return this.sendAudioRequest(ToShopfront.AUDIO_REQUEST_PERMISSION);
    }

    /**
     * @inheritDoc
     */
    public audioPreload(url: string): Promise<ShopfrontResponse> {
        return this.sendAudioRequest(
            ToShopfront.AUDIO_PRELOAD,
            {
                url,
            }
        );
    }

    /**
     * @inheritDoc
     */
    public audioPlay(url: string): Promise<ShopfrontResponse> {
        return this.sendAudioRequest(
            ToShopfront.AUDIO_PLAY,
            {
                url,
            }
        );
    }

    /**
     * Checks whether `data` is formatted as response data to a 'get option' request
     */
    protected dataIsOption<TValueType>(data: Record<string, unknown>): data is {
        requestId: string;
        option: string;
        value: TValueType | undefined;
    } {
        return typeof data.requestId === "string" && typeof data.option === "string";
    }

    /**
     * @inheritDoc
     */
    public async getOption<TValueType>(option: string, defaultValue: TValueType): Promise<TValueType> {
        const request = `OptionRequest-${Date.now().toString()}`;

        const promise = new Promise<TValueType | undefined>(res => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener = (
                event: keyof FromShopfrontInternal | keyof FromShopfront,
                data: Record<string, unknown>
            ) => {
                if(event !== "RESPONSE_OPTION") {
                    return;
                }

                if(!this.dataIsOption<TValueType>(data)) {
                    return;
                }

                if(data.requestId !== request) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res(data.value);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.GET_OPTION, {
            requestId: request,
            option,
        });

        const optionValue = await promise;

        if(typeof optionValue === "undefined") {
            return defaultValue;
        }

        return optionValue;
    }

    /**
     * Checks whether `data` is formatted as response data to an embedded token request
     */
    protected dataIsEmbeddedToken(data: Record<string, unknown>): data is {
        requestId: string;
        data: BufferSource;
        signature: BufferSource;
    } {
        return typeof data.requestId === "string" && typeof data.data === "object" && data.data !== null;
    }

    /**
     * Generates a signing key and sends it to Shopfront
     */
    protected async generateSigningKey(): Promise<void> {
        if(typeof this.signingKey !== "undefined") {
            return;
        }

        this.signingKey = await crypto.subtle.generateKey({
            name      : "ECDSA",
            namedCurve: "P-384",
        }, true, [ "sign", "verify" ]);

        this.bridge.sendMessage(ToShopfront.ROTATE_SIGNING_KEY, await crypto.subtle.exportKey(
            "jwk",
            this.signingKey.privateKey
        ));
    }

    /**
     * Decodes the embedded token response from Shopfront using the signing key
     */
    protected async decodeToken(
        signature: BufferSource,
        data: BufferSource,
        returnTokenObject?: boolean
    ): Promise<ShopfrontEmbeddedVerificationToken | string> {
        if(typeof this.signingKey === "undefined") {
            // Not possible to decode
            throw new Error("Unable to decode token due to a missing signing key");
        }

        if(!(
            await crypto.subtle.verify({
                name: "ECDSA",
                hash: {
                    name: "SHA-384",
                },
            }, this.signingKey.publicKey, signature, data)
        )) {
            throw new ShopfrontTokenDecodingError();
        }

        const decoded = JSON.parse(new TextDecoder().decode(data)) as ShopfrontEmbeddedVerificationToken;

        if(decoded.app !== this.bridge.key) {
            throw new ShopfrontTokenDecodingError();
        }

        if(decoded.url.loaded !== location.href) {
            throw new ShopfrontTokenDecodingError();
        }

        if(returnTokenObject) {
            return decoded;
        }

        return decoded.auth;
    }

    /**
     * Checks whether `data` is an error response from an embedded token request
     */
    protected tokenDataContainsErrors(data: unknown): data is ShopfrontEmbeddedTokenError {
        if(!data || typeof data !== "object") {
            return false;
        }

        return "error" in data && "type" in data;
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
        await this.generateSigningKey();

        const request = `TokenRequest-${Date.now().toString()}`;
        const promise = new Promise<[BufferSource, BufferSource]>(res => {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const listener: ApplicationEventListener = (event, data) => {
                if(event !== "RESPONSE_SECURE_KEY") {
                    return;
                }

                if(!this.dataIsEmbeddedToken(data)) {
                    return;
                }

                if(data.requestId !== request) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res([ data.signature, data.data ]);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.REQUEST_SECURE_KEY, {
            requestId: request,
        });

        const [ signature, data ] = await promise;

        // Throw the error if there is one
        if(this.tokenDataContainsErrors(data)) {
            throw new ShopfrontTokenRequestError(data.type);
        }

        return this.decodeToken(signature, data, returnTokenObject);
    }
}
