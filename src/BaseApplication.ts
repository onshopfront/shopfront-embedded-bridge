import { BaseDatabase } from "./APIs/Database/BaseDatabase.js";
import { BaseCurrentSale } from "./APIs/Sale/BaseCurrentSale.js";
import { Sale } from "./APIs/Sale/index.js";
import {
    DirectShopfrontEvent,
    DirectShopfrontEventCallback,
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontInternal,
    ListenableFromShopfrontEvents,
    RegisterChangedEvent,
    SellScreenActionMode,
    SellScreenSummaryMode,
    SoundEvents,
} from "./ApplicationEvents.js";
import { BaseBridge } from "./BaseBridge.js";
import { Serializable } from "./Common/Serializable.js";
import { BaseEmitableEvent } from "./EmitableEvents/BaseEmitableEvent.js";
import { BaseEvent } from "./Events/BaseEvent.js";
import { MaybePromise } from "./Utilities/MiscTypes.js";

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

export abstract class BaseApplication<
    BridgeType extends BaseBridge = BaseBridge,
    DatabaseType extends BaseDatabase = BaseDatabase
> {
    protected bridge: BridgeType;
    protected isReady: boolean;
    protected key: string;
    protected register: string | null;
    protected outlet: string | null;
    protected user: string | null;
    protected signingKey: CryptoKeyPair | undefined;
    protected listeners: {
        [key in ListenableFromShopfrontEvents]: Map<
            (...args: Array<unknown>) => void,
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
    protected directListeners: Partial<Record<DirectShopfrontEvent, Set<DirectShopfrontEventCallback>>> = {};
    public database: DatabaseType;

    protected constructor(bridge: BridgeType, database: DatabaseType) {
        this.bridge   = bridge;
        this.isReady  = false;
        this.key      = "";
        this.register = null;
        this.outlet   = null;
        this.user     = null;
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
        event: ListenableFromShopfrontEvents | DirectShopfrontEvent,
        data: Record<string, unknown>,
        id: string
    ): MaybePromise<void>;

    /**
     * Register a listener for a Shopfront event
     */
    public abstract addEventListener<E extends ListenableFromShopfrontEvents>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * Register a listener for a Shopfront event
     */
    public abstract addEventListener(
        event: DirectShopfrontEvent,
        callback: DirectShopfrontEventCallback
    ): void;
    /**
     * Register a listener for a Shopfront event
     */
    public abstract addEventListener(
        event: ListenableFromShopfrontEvents | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => void
    ): void;

    /**
     * Removed a registered listener for a Shopfront event
     */
    public abstract removeEventListener<E extends keyof FromShopfrontCallbacks>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    /**
     * Removed a registered listener for a Shopfront event
     */
    public abstract removeEventListener<D>(
        event: DirectShopfrontEvent,
        callback: (event: D) => MaybePromise<void>
    ): void;
    /**
     * Removed a registered listener for a Shopfront event
     */
    public abstract removeEventListener(
        event: ListenableFromShopfrontEvents | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => MaybePromise<void>
    ): void;

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
    public abstract load(): void;

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
