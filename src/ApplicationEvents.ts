/* eslint @typescript-eslint/no-invalid-void-type: 0 */
import { Button } from "./Actions/Button.js";
import { SaleKey } from "./Actions/SaleKey.js";
import { type OrderDetails } from "./APIs/Fulfilment/FulfilmentTypes.js";
import { InternalMessageSource } from "./APIs/InternalMessages/InternalMessageSource.js";
import { Sale, type ShopfrontSaleState } from "./APIs/Sale/index.js";
import { AudioPermissionChange } from "./Events/AudioPermissionChange.js";
import { AudioReady } from "./Events/AudioReady.js";
import { Callback } from "./Events/Callback.js";
import { SaleAddCustomer } from "./Events/DirectEvents/SaleAddCustomer.js";
import { SaleAddProduct } from "./Events/DirectEvents/SaleAddProduct.js";
import { SaleChangeQuantity } from "./Events/DirectEvents/SaleChangeQuantity.js";
import { SaleClear } from "./Events/DirectEvents/SaleClear.js";
import { SaleRemoveCustomer } from "./Events/DirectEvents/SaleRemoveCustomer.js";
import { SaleRemoveProduct } from "./Events/DirectEvents/SaleRemoveProduct.js";
import { SaleUpdateProducts } from "./Events/DirectEvents/SaleUpdateProducts.js";
import { type SaleEventProduct } from "./Events/DirectEvents/types/SaleEventData.js";
import { FormatIntegratedProduct, type FormattedSaleProduct } from "./Events/FormatIntegratedProduct.js";
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
import { RequestCustomerListOptions, type SellScreenCustomerListOption } from "./Events/RequestCustomerListOptions.js";
import { RequestSaleKeys } from "./Events/RequestSaleKeys.js";
import { RequestSellScreenOptions, type SellScreenOption } from "./Events/RequestSellScreenOptions.js";
import { RequestSettings } from "./Events/RequestSettings.js";
import { RequestTableColumns } from "./Events/RequestTableColumns.js";
import { type CompletedSale, SaleComplete } from "./Events/SaleComplete.js";
import { UIPipeline } from "./Events/UIPipeline.js";
import { type MaybePromise } from "./Utilities/MiscTypes.js";

export enum ToShopfront {
    READY = "READY",
    SERIALIZED = "SERIALIZED",
    RESPONSE_BUTTONS = "RESPONSE_BUTTONS",
    RESPONSE_SETTINGS = "RESPONSE_SETTINGS",
    RESPONSE_TABLE_COLUMNS = "RESPONSE_TABLE_COLUMNS",
    RESPONSE_SELL_SCREEN_OPTIONS = "RESPONSE_SELL_SCREEN_OPTIONS",
    DOWNLOAD = "DOWNLOAD",
    LOAD = "LOAD",
    REQUEST_CURRENT_SALE = "REQUEST_CURRENT_SALE",
    DATABASE_REQUEST = "DATABASE_REQUEST",
    UNSUPPORTED_EVENT = "UNSUPPORTED_EVENT",
    NOT_LISTENING_TO_EVENT = "NOT_LISTENING_TO_EVENT",
    REQUEST_LOCATION = "REQUEST_LOCATION",
    RESPONSE_FORMAT_PRODUCT = "RESPONSE_FORMAT_PRODUCT",
    RESPONSE_CUSTOMER_LIST_OPTIONS = "RESPONSE_CUSTOMER_LIST_OPTIONS",
    RESPONSE_SALE_KEYS = "RESPONSE_SALE_KEYS",
    PRINT_RECEIPT = "PRINT_RECEIPT",
    REDIRECT = "REDIRECT",
    GET_OPTION = "GET_OPTION",
    RESPONSE_UI_PIPELINE = "RESPONSE_UI_PIPELINE",
    RESPONSE_GIFT_CARD_CODE_CHECK = "RESPONSE_GIFT_CARD_CODE_CHECK",
    REQUEST_SECURE_KEY = "REQUEST_SECURE_KEY",
    ROTATE_SIGNING_KEY = "ROTATE_SIGNING_KEY",

    // Audio Events
    AUDIO_REQUEST_PERMISSION = "AUDIO_REQUEST_PERMISSION",
    AUDIO_PRELOAD = "AUDIO_PRELOAD",
    AUDIO_PLAY = "AUDIO_PLAY",

    // Sell Screen Events
    CHANGE_SELL_SCREEN_ACTION_MODE = "CHANGE_SELL_SCREEN_ACTION_MODE",
    CHANGE_SELL_SCREEN_SUMMARY_MODE = "CHANGE_SELL_SCREEN_SUMMARY_MODE",

    // Emitable Events
    SELL_SCREEN_OPTION_CHANGE = "SELL_SCREEN_OPTION_CHANGE",
    INTERNAL_PAGE_MESSAGE = "INTERNAL_PAGE_MESSAGE",
    TABLE_UPDATE = "TABLE_UPDATE",
    PIPELINE_TRIGGER = "PIPELINE_TRIGGER",
    SELL_SCREEN_PROMOTION_APPLICABLE = "SELL_SCREEN_PROMOTION_APPLICABLE",

    // Fulfilment Emitable Events
    FULFILMENT_OPT_IN = "FULFILMENT_OPT_IN",
    FULFILMENT_OPTIONS = "FULFILMENT_OPTIONS",
    FULFILMENT_ORDERS_SYNC = "FULFILMENT_ORDERS_SYNC",
    FULFILMENT_ORDERS_CREATE = "FULFILMENT_ORDERS_CREATE",
    FULFILMENT_ORDERS_UPDATE = "FULFILMENT_ORDERS_UPDATE",
    FULFILMENT_ORDERS_CANCEL = "FULFILMENT_ORDERS_CANCEL",

    // Sale API events
    CREATE_SALE = "CREATE_SALE",

    // Fulfilment Response Events
    FULFILMENT_GET_ORDER = "FULFILMENT_GET_ORDER",
}

export type SoundEvents = ToShopfront.AUDIO_REQUEST_PERMISSION | ToShopfront.AUDIO_PRELOAD | ToShopfront.AUDIO_PLAY;

export interface FromShopfrontReturns {
    READY: unknown;
    REQUEST_SETTINGS: {
        logo?: string;
        description?: string;
        url?: string;
        html?: string;
    };
    REQUEST_BUTTONS: Array<Button>;
    REQUEST_TABLE_COLUMNS: null | {
        headers: Array<{
            label: string;
            key: string;
            weight: number;
        }>;
        body: Array<Record<string, string>>;
        footer: Record<string, string>;
    };
    REQUEST_SELL_SCREEN_OPTIONS: Array<SellScreenOption>;
    CALLBACK: unknown;
    RESPONSE_CURRENT_SALE: {
        requestId: string;
        saleState: ShopfrontSaleState;
    };
    INTERNAL_PAGE_MESSAGE: unknown;
    REGISTER_CHANGED: unknown;
    RESPONSE_LOCATION: {
        requestId: string;
        register: string | null;
        outlet: string | null;
        user: string | null;
    };
    RESPONSE_AUDIO_REQUEST: {
        requestId: string;
        success: boolean;
        message?: string;
    };
    FORMAT_INTEGRATED_PRODUCT: FormatIntegratedProductEvent;
    REQUEST_CUSTOMER_LIST_OPTIONS: Array<SellScreenCustomerListOption>;
    REQUEST_SALE_KEYS: Array<SaleKey>;
    SALE_COMPLETE: unknown;
    UI_PIPELINE: Array<UIPipelineResponse>;
    PAYMENT_METHODS_ENABLED: Array<SellScreenPaymentMethod>;
    AUDIO_READY: unknown;
    AUDIO_PERMISSION_CHANGE: unknown;
    FULFILMENT_GET_ORDER: OrderDetails;
    FULFILMENT_VOID_ORDER: unknown;
    FULFILMENT_PROCESS_ORDER: unknown;
    FULFILMENT_ORDER_APPROVAL: unknown;
    FULFILMENT_ORDER_COLLECTED: unknown;
    FULFILMENT_ORDER_COMPLETED: unknown;
    RESPONSE_CREATE_SALE: {
        requestId: string;
        success: boolean;
        message?: string;
    };
    GIFT_CARD_CODE_CHECK: {
        code: string;
        message: string | null;
    };
}

export interface InternalPageMessageEvent {
    method: "REQUEST_SETTINGS" | "REQUEST_SELL_SCREEN_OPTIONS" | "EXTERNAL_APPLICATION";
    url: string;
    message: unknown;
    reference: InternalMessageSource;
}

export interface RegisterChangedEvent {
    register: null | string;
    outlet: null | string;
    user: null | string;
}

export interface GiftCardCodeCheckEvent {
    code: string;
    message: string | null;
}

export interface FormatIntegratedProductEvent {
    product: FormattedSaleProduct;
}

export interface SaleCompletedEvent {
    sale: CompletedSale;
}

export interface AudioPermissionChangeEvent {
    permitted: boolean;
}

export interface FulfilmentProcessEvent {
    id: string;
    sale: Sale;
}

export interface FulfilmentApprovalEvent {
    id: string;
    approved: boolean;
}

export interface UIPipelineResponse {
    name: string;
    content: string;
}

export interface UIPipelineBaseContext {
    location: string;
}

export interface UIPipelineContext extends UIPipelineBaseContext {
    trigger?: () => void;
}

export interface SellScreenPaymentMethod {
    uuid: string;
    name: string;
    type:
        "global" |
        "cash" |
        "eftpos" |
        "giftcard" |
        "voucher" |
        "cheque" |
        "pc-eftpos" |
        "linkly-vaa" |
        "direct-deposit" |
        "tyro" |
        "custom";
    default_pay_exact: boolean;
    background_colour?: string;
    text_colour?: string;
}

export interface PaymentMethodEnabledContext {
    register: string;
    customer: false | {
        uuid: string;
    };
}

export interface FromShopfrontCallbacks {
    READY: (event: RegisterChangedEvent) => MaybePromise<FromShopfrontReturns["READY"]>;
    REQUEST_SETTINGS: () => MaybePromise<FromShopfrontReturns["REQUEST_SETTINGS"]>;
    REQUEST_BUTTONS: (location: string, context: unknown) => MaybePromise<FromShopfrontReturns["REQUEST_BUTTONS"]>;
    REQUEST_TABLE_COLUMNS: (
        location: string,
        data: unknown
    ) => MaybePromise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>;
    REQUEST_SELL_SCREEN_OPTIONS: () => MaybePromise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>;
    INTERNAL_PAGE_MESSAGE: (
        event: InternalPageMessageEvent
    ) => MaybePromise<FromShopfrontReturns["INTERNAL_PAGE_MESSAGE"]>;
    REGISTER_CHANGED: (event: RegisterChangedEvent) => MaybePromise<FromShopfrontReturns["REGISTER_CHANGED"]>;
    CALLBACK: () => MaybePromise<FromShopfrontReturns["CALLBACK"]>;
    FORMAT_INTEGRATED_PRODUCT: (
        event: FormatIntegratedProductEvent
    ) => MaybePromise<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>;
    REQUEST_CUSTOMER_LIST_OPTIONS: () => MaybePromise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]>;
    REQUEST_SALE_KEYS: () => MaybePromise<FromShopfrontReturns["REQUEST_SALE_KEYS"]>;
    SALE_COMPLETE: (event: SaleCompletedEvent) => MaybePromise<FromShopfrontReturns["SALE_COMPLETE"]>;
    UI_PIPELINE: (
        event: Array<UIPipelineResponse>,
        context: UIPipelineContext
    ) => MaybePromise<FromShopfrontReturns["UI_PIPELINE"]>;
    PAYMENT_METHODS_ENABLED: (
        event: Array<SellScreenPaymentMethod>,
        context: PaymentMethodEnabledContext
    ) => MaybePromise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]>;
    AUDIO_READY: () => MaybePromise<FromShopfrontReturns["AUDIO_READY"]>;
    AUDIO_PERMISSION_CHANGE: (
        event: AudioPermissionChangeEvent
    ) => MaybePromise<FromShopfrontReturns["AUDIO_PERMISSION_CHANGE"]>;
    FULFILMENT_GET_ORDER: (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>;
    FULFILMENT_VOID_ORDER: (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_VOID_ORDER"]>;
    FULFILMENT_PROCESS_ORDER: (
        event: FulfilmentProcessEvent
    ) => MaybePromise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]>;
    FULFILMENT_ORDER_APPROVAL: (
        event: FulfilmentApprovalEvent
    ) => MaybePromise<FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]>;
    FULFILMENT_ORDER_COLLECTED: (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_ORDER_COLLECTED"]>;
    FULFILMENT_ORDER_COMPLETED: (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_ORDER_COMPLETED"]>;
    GIFT_CARD_CODE_CHECK: (
        event: GiftCardCodeCheckEvent,
        context: unknown
    ) => MaybePromise<FromShopfrontReturns["GIFT_CARD_CODE_CHECK"]>;
}

export interface FromShopfront {
    READY: Ready;
    REQUEST_SETTINGS: RequestSettings;
    REQUEST_BUTTONS: RequestButtons;
    REQUEST_TABLE_COLUMNS: RequestTableColumns;
    REQUEST_SELL_SCREEN_OPTIONS: RequestSellScreenOptions;
    CALLBACK: Callback;
    INTERNAL_PAGE_MESSAGE: InternalPageMessage;
    REGISTER_CHANGED: RegisterChanged;
    FORMAT_INTEGRATED_PRODUCT: FormatIntegratedProduct;
    REQUEST_CUSTOMER_LIST_OPTIONS: RequestCustomerListOptions;
    SALE_COMPLETE: SaleComplete;
    REQUEST_SALE_KEYS: RequestSaleKeys;
    UI_PIPELINE: UIPipeline;
    PAYMENT_METHODS_ENABLED: PaymentMethodsEnabled;
    AUDIO_READY: AudioReady;
    AUDIO_PERMISSION_CHANGE: AudioPermissionChange;
    FULFILMENT_GET_ORDER: FulfilmentGetOrder;
    FULFILMENT_VOID_ORDER: FulfilmentVoidOrder;
    FULFILMENT_PROCESS_ORDER: FulfilmentProcessOrder;
    FULFILMENT_ORDER_APPROVAL: FulfilmentOrderApproval;
    FULFILMENT_ORDER_COLLECTED: FulfilmentCollectOrder;
    FULFILMENT_ORDER_COMPLETED: FulfilmentCompleteOrder;
    GIFT_CARD_CODE_CHECK: GiftCardCodeCheck;
}

export type ListenableFromShopfrontEvent = keyof Omit<FromShopfront, "CALLBACK">;

export interface DirectShopfrontEventData {
    SALE_ADD_PRODUCT: {
        product: SaleEventProduct;
        indexAddress: Array<number>;
    };
    SALE_REMOVE_PRODUCT: {
        indexAddress: Array<number>;
    };
    SALE_CHANGE_QUANTITY: {
        indexAddress: Array<number>;
        amount: number;
        absolute: boolean;
    };
    SALE_UPDATE_PRODUCTS: {
        products: Array<SaleEventProduct>;
    };
    SALE_ADD_CUSTOMER: {
        customer: {
            uuid: string;
        };
    };
    SALE_REMOVE_CUSTOMER: undefined;
    SALE_CLEAR: undefined;
}

export interface DirectShopfrontCallbacks {
    SALE_ADD_PRODUCT: (event: DirectShopfrontEventData["SALE_ADD_PRODUCT"]) => MaybePromise<void>;
    SALE_REMOVE_PRODUCT: (event: DirectShopfrontEventData["SALE_REMOVE_PRODUCT"]) => MaybePromise<void>;
    SALE_CHANGE_QUANTITY: (event: DirectShopfrontEventData["SALE_CHANGE_QUANTITY"]) => MaybePromise<void>;
    SALE_UPDATE_PRODUCTS: (event: DirectShopfrontEventData["SALE_UPDATE_PRODUCTS"]) => MaybePromise<void>;
    SALE_ADD_CUSTOMER: (event: DirectShopfrontEventData["SALE_ADD_CUSTOMER"]) => MaybePromise<void>;
    SALE_REMOVE_CUSTOMER: () => MaybePromise<void>;
    SALE_CLEAR: () => MaybePromise<void>;
}

export interface DirectShopfront {
    SALE_ADD_PRODUCT: SaleAddProduct;
    SALE_REMOVE_PRODUCT: SaleRemoveProduct;
    SALE_CHANGE_QUANTITY: SaleChangeQuantity;
    SALE_UPDATE_PRODUCTS: SaleUpdateProducts;
    SALE_ADD_CUSTOMER: SaleAddCustomer;
    SALE_REMOVE_CUSTOMER: SaleRemoveCustomer;
    SALE_CLEAR: SaleClear;
}

export type DirectShopfrontEvent = keyof DirectShopfront;

export const directShopfrontEvents: Array<DirectShopfrontEvent> = [
    "SALE_ADD_PRODUCT",
    "SALE_REMOVE_PRODUCT",
    "SALE_UPDATE_PRODUCTS",
    "SALE_CHANGE_QUANTITY",
    "SALE_ADD_CUSTOMER",
    "SALE_REMOVE_CUSTOMER",
    "SALE_CLEAR",
] as const;

/**
 * Checks whether the event is a direct Shopfront event
 */
export const isDirectShopfrontEvent = (
    event: DirectShopfrontEvent | ListenableFromShopfrontEvent
): event is DirectShopfrontEvent => {
    return directShopfrontEvents.includes(event as DirectShopfrontEvent);
};

export interface FromShopfrontInternal {
    CYCLE_KEY: "CYCLE_KEY";
    LOCATION_CHANGED: "LOCATION_CHANGED";
    RESPONSE_CURRENT_SALE: "RESPONSE_CURRENT_SALE";
    RESPONSE_DATABASE_REQUEST: "RESPONSE_DATABASE_REQUEST";
    RESPONSE_LOCATION: "RESPONSE_LOCATION";
    RESPONSE_OPTION: "RESPONSE_OPTION";
    RESPONSE_AUDIO_REQUEST: "RESPONSE_AUDIO_REQUEST";
    RESPONSE_SECURE_KEY: "RESPONSE_SECURE_KEY";
    RESPONSE_CREATE_SALE: "RESPONSE_CREATE_SALE";
}

export type SellScreenActionMode =
    "search" |
    "keys" |
    "held-sales" |
    "payment" |
    "customers" |
    "promotions" |
    "show-backorders" |
    "fulfilment-orders";

export type SellScreenSummaryMode = "transaction" | "payments" | "receipts";
