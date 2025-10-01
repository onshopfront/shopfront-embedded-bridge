import { BaseDatabase } from "./APIs/Database/BaseDatabase.js";
import { BaseCurrentSale } from "./APIs/Sale/BaseCurrentSale.js";
import { Sale } from "./APIs/Sale/index.js";
import { Application } from "./Application.js";
import {
    DirectShopfront,
    DirectShopfrontCallbacks,
    DirectShopfrontEvent,
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontInternal,
    isDirectShopfrontEvent,
    ListenableFromShopfrontEvent,
    RegisterChangedEvent,
    SellScreenActionMode,
    SellScreenSummaryMode,
    SoundEvents,
} from "./ApplicationEvents.js";
import { BaseBridge } from "./BaseBridge.js";
import { Serializable } from "./Common/Serializable.js";
import { BaseEmitableEvent } from "./EmitableEvents/BaseEmitableEvent.js";
import { AudioPermissionChange } from "./Events/AudioPermissionChange.js";
import { AudioReady } from "./Events/AudioReady.js";
import { BaseEvent } from "./Events/BaseEvent.js";
import { SaleAddCustomer } from "./Events/DirectEvents/SaleAddCustomer.js";
import { SaleAddProduct } from "./Events/DirectEvents/SaleAddProduct.js";
import { SaleChangeQuantity } from "./Events/DirectEvents/SaleChangeQuantity.js";
import { SaleClear } from "./Events/DirectEvents/SaleClear.js";
import { SaleRemoveCustomer } from "./Events/DirectEvents/SaleRemoveCustomer.js";
import { SaleRemoveProduct } from "./Events/DirectEvents/SaleRemoveProduct.js";
import { SaleUpdateProducts } from "./Events/DirectEvents/SaleUpdateProducts.js";
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
import { AnyFunction, MaybePromise } from "./Utilities/MiscTypes.js";

export interface ShopfrontResponse {
    success: boolean;
    message?: string;
}

export interface ShopfrontEmbeddedVerificationToken {
    auth: string;
    id: string;
    app: string;
    user: string;
    url: {
        raw: string;
        loaded: string;
    };
}

export interface ShopfrontEmbeddedTokenError {
    error: boolean;
    type: string;
}

export class ShopfrontTokenDecodingError extends Error {}

export class ShopfrontTokenRequestError extends Error {}

export abstract class BaseApplication {
    protected bridge: BaseBridge;
    protected isReady: boolean;
    protected key: string;
    protected register: string | null;
    protected outlet: string | null;
    protected user: string | null;
    protected signingKey: CryptoKeyPair | undefined;
    protected listeners: {
        [key in ListenableFromShopfrontEvent]: Map<
            AnyFunction,
            FromShopfront[key] & BaseEvent
        >;
    } = {
        READY                        : new Map(),
        REQUEST_SETTINGS             : new Map(),
        REQUEST_BUTTONS              : new Map(),
        REQUEST_TABLE_COLUMNS        : new Map(),
        REQUEST_SELL_SCREEN_OPTIONS  : new Map(),
        INTERNAL_PAGE_MESSAGE        : new Map(),
        REGISTER_CHANGED             : new Map(),
        FORMAT_INTEGRATED_PRODUCT    : new Map(),
        REQUEST_CUSTOMER_LIST_OPTIONS: new Map(),
        REQUEST_SALE_KEYS            : new Map(),
        SALE_COMPLETE                : new Map(),
        UI_PIPELINE                  : new Map(),
        PAYMENT_METHODS_ENABLED      : new Map(),
        AUDIO_PERMISSION_CHANGE      : new Map(),
        AUDIO_READY                  : new Map(),
        FULFILMENT_GET_ORDER         : new Map(),
        FULFILMENT_PROCESS_ORDER     : new Map(),
        FULFILMENT_VOID_ORDER        : new Map(),
        FULFILMENT_ORDER_APPROVAL    : new Map(),
        FULFILMENT_ORDER_COLLECTED   : new Map(),
        FULFILMENT_ORDER_COMPLETED   : new Map(),
        GIFT_CARD_CODE_CHECK         : new Map(),
    };
    protected directListeners: {
        [key in DirectShopfrontEvent]: Map<
            AnyFunction,
            DirectShopfront[key]
        >;
    } = {
        SALE_ADD_PRODUCT    : new Map(),
        SALE_REMOVE_PRODUCT : new Map(),
        SALE_CHANGE_QUANTITY: new Map(),
        SALE_UPDATE_PRODUCTS: new Map(),
        SALE_ADD_CUSTOMER   : new Map(),
        SALE_REMOVE_CUSTOMER: new Map(),
        SALE_CLEAR          : new Map(),
    };
    public database: BaseDatabase;

    protected constructor(bridge: BaseBridge, database: BaseDatabase) {
        this.bridge = bridge;
        this.isReady = false;
        this.key = "";
        this.register = null;
        this.outlet = null;
        this.user = null;
        this.database = database;
    }

    /**
     * Destroy the bridge instance
     */
    public abstract destroy(): void;

    /**
     * Handles an application event
     */
    protected abstract handleEvent(
        event: keyof FromShopfront | keyof FromShopfrontInternal,
        data: Record<string, unknown>,
        id: string
    ): void;

    /**
     * Calls any registered listeners for the received event
     */
    protected abstract emit(
        event: ListenableFromShopfrontEvent | DirectShopfrontEvent,
        data: Record<string, unknown>,
        id: string
    ): MaybePromise<void>;

    /**
     * Register a listener for a Shopfront event
     */
    public addEventListener<E extends ListenableFromShopfrontEvent>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * Register a listener for a Shopfront event
     */
    public addEventListener<D extends DirectShopfrontEvent>(
        event: D,
        callback: DirectShopfrontCallbacks[D]
    ): void;
    /**
     * Register a listener for a Shopfront event
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
     * Removed a registered listener for a Shopfront event
     */
    public removeEventListener<E extends ListenableFromShopfrontEvent>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * Removed a registered listener for a Shopfront event
     */
    public removeEventListener<D extends DirectShopfrontEvent>(
        event: D,
        callback: DirectShopfrontCallbacks[D]
    ): void;
    /**
     * Removed a registered listener for a Shopfront event
     */
    public removeEventListener(
        event: ListenableFromShopfrontEvent | DirectShopfrontEvent,
        callback: AnyFunction
    ): void {
        if(isDirectShopfrontEvent(event)) {
            this.directListeners[event].delete(callback);

            return;
        }

        this.listeners[event].delete(callback);
    }

    /**
     * Send data to Shopfront
     */
    public abstract send(item: BaseEmitableEvent<unknown> | Serializable<unknown>): void;

    /**
     * Requests permission from the user to download the specified file
     */
    public abstract download(file: string): void;

    /**
     * Redirects the user to the specified location.
     * If `externalRedirect` is `true`, the user is prompted to confirm the redirect.
     */
    public abstract redirect(toLocation: string, externalRedirect: boolean): void;

    /**
     * Shows a loading screen in Shopfront
     */
    public abstract load(): () => void;

    protected abstract handleEventCallback(data: { id?: string; data: unknown; }): void;

    protected abstract handleLocationChanged(data: RegisterChangedEvent): void;

    /**
     * Retrieves the cached authentication key
     */
    public abstract getAuthenticationKey(): string;

    /**
     * Get the current sale on the sell screen, if the current device is not a register
     * then this will return false.
     */
    public abstract getCurrentSale(): Promise<BaseCurrentSale | false>;

    /**
     * Send the sale to be created on shopfront.
     */
    public abstract createSale(sale: Sale): Promise<ShopfrontResponse>;

    /**
     * Retrieves the current location data from Shopfront
     */
    public abstract getLocation(): Promise<{
        register: string | null;
        outlet: string | null;
        user: string | null;
    }>;

    /**
     * Prints the provided content as a receipt
     */
    public abstract printReceipt(content: string): void;

    /**
     * Changes the display mode of the sell screen's `action` container
     */
    public abstract changeSellScreenActionMode(mode: SellScreenActionMode): void;

    /**
     * Changes the display mode of the sell screen's 'summary' container
     */
    public abstract changeSellScreenSummaryMode(mode: SellScreenSummaryMode): void;

    /**
     * Sends an audio request to Shopfront
     */
    protected abstract sendAudioRequest(type: SoundEvents, data?: unknown): Promise<ShopfrontResponse>;

    /**
     * Requests permission from the user to be able to play audio
     */
    public abstract requestAudioPermission(): Promise<ShopfrontResponse>;

    /**
     * Requests Shopfront to preload audio so that it can be pre-cached before being played
     */
    public abstract audioPreload(url: string): Promise<ShopfrontResponse>;

    /**
     * Attempts to play the provided audio in Shopfront
     */
    public abstract audioPlay(url: string): Promise<ShopfrontResponse>;

    /**
     * Retrieve the value of the specified option from Shopfront
     */
    public abstract getOption<TValueType>(option: string, defaultValue: TValueType): Promise<TValueType>;

    /**
     * Retrieves an embedded token from Shopfront that can be used to validate server requests
     */
    public abstract getToken(returnTokenObject: true): Promise<ShopfrontEmbeddedVerificationToken>;
    /**
     * Retrieves an embedded token from Shopfront that can be used to validate server requests
     */
    public abstract getToken(returnTokenObject?: false): Promise<string>;
    /**
     * Retrieves an embedded token from Shopfront that can be used to validate server requests
     */
    public abstract getToken(returnTokenObject?: boolean): Promise<string | ShopfrontEmbeddedVerificationToken>;
}
