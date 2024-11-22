import { Ready } from "./Events/Ready";
import { Button } from "./Actions/Button";
import { RequestSettings } from "./Events/RequestSettings";
import { RequestButtons } from "./Events/RequestButtons";
import { Callback } from "./Events/Callback";
import { RequestTableColumns } from "./Events/RequestTableColumns";
import { RequestSellScreenOptions, SellScreenOption } from "./Events/RequestSellScreenOptions";
import { ShopfrontSaleState } from "./APIs/Sale";
import { InternalPageMessage } from "./Events/InternalPageMessage";
import { InternalMessageSource } from "./APIs/InternalMessages/InternalMessageSource";
import { RegisterChanged } from "./Events/RegisterChanged";
import { FormatIntegratedProduct, FormattedSaleProduct } from "./Events/FormatIntegratedProduct";
import { MaybePromise } from "./Utilities/MiscTypes";
import { RequestCustomerListOptions, SellScreenCustomerListOption } from "./Events/RequestCustomerListOptions";
import { SaleKey } from "./Actions/SaleKey";
import { RequestSaleKeys } from "./Events/RequestSaleKeys";
import { CompletedSale, SaleComplete } from "./Events/SaleComplete";
import { UIPipeline } from "./Events/UIPipeline";
import { PaymentMethodsEnabled } from "./Events/PaymentMethodsEnabled";
import { AudioPermissionChange } from "./Events/AudioPermissionChange";
import { FulfilmentGetOrder } from "./Events/FulfilmentGetOrder";
import { FulfilmentVoidOrder } from "./Events/FulfilmentVoidOrder";
import { FulfilmentProcessOrder } from "./Events/FulfilmentProcessOrder";
import { FulfilmentOrderApproval } from "./Events/FulfilmentOrderApproval";
import { OrderDetails } from "./APIs/Fulfilment/FulfilmentTypes";
import { FulfilmentCollectOrder } from "./Events/FulfilmentCollectOrder";
import { FulfilmentCompleteOrder } from "./Events/FulfilmentCompleteOrder";
import { Sale } from "./APIs/Sale";
import { AudioReady } from "./Events/AudioReady";
import {CheckGiftCardCollision} from "./Events/CheckGiftCardCollision";

export enum ToShopfront {
    READY                              = "READY",
    SERIALIZED                         = "SERIALIZED",
    RESPONSE_BUTTONS                   = "RESPONSE_BUTTONS",
    RESPONSE_SETTINGS                  = "RESPONSE_SETTINGS",
    RESPONSE_TABLE_COLUMNS             = "RESPONSE_TABLE_COLUMNS",
    RESPONSE_SELL_SCREEN_OPTIONS       = "RESPONSE_SELL_SCREEN_OPTIONS",
    DOWNLOAD                           = "DOWNLOAD",
    LOAD                               = "LOAD",
    REQUEST_CURRENT_SALE               = "REQUEST_CURRENT_SALE",
    DATABASE_REQUEST                   = "DATABASE_REQUEST",
    UNSUPPORTED_EVENT                  = "UNSUPPORTED_EVENT",
    NOT_LISTENING_TO_EVENT             = "NOT_LISTENING_TO_EVENT",
    REQUEST_LOCATION                   = "REQUEST_LOCATION",
    RESPONSE_FORMAT_PRODUCT            = "RESPONSE_FORMAT_PRODUCT",
    RESPONSE_CUSTOMER_LIST_OPTIONS     = "RESPONSE_CUSTOMER_LIST_OPTIONS",
    RESPONSE_SALE_KEYS                 = "RESPONSE_SALE_KEYS",
    PRINT_RECEIPT                      = "PRINT_RECEIPT",
    REDIRECT                           = "REDIRECT",
    GET_OPTION                         = "GET_OPTION",
    RESPONSE_UI_PIPELINE               = "RESPONSE_UI_PIPELINE",
    RESPONSE_CHECK_GIFT_CODE_COLLISION = "RESPONSE_CHECK_GIFT_CODE_COLLISION",
    REQUEST_SECURE_KEY                 = "REQUEST_SECURE_KEY",
    ROTATE_SIGNING_KEY                 = "ROTATE_SIGNING_KEY",

    // Audio Events
    AUDIO_REQUEST_PERMISSION = "AUDIO_REQUEST_PERMISSION",
    AUDIO_PRELOAD            = "AUDIO_PRELOAD",
    AUDIO_PLAY               = "AUDIO_PLAY",

    // Sell Screen Events
    CHANGE_SELL_SCREEN_ACTION_MODE  = "CHANGE_SELL_SCREEN_ACTION_MODE",
    CHANGE_SELL_SCREEN_SUMMARY_MODE = "CHANGE_SELL_SCREEN_SUMMARY_MODE",

    // Emitable Events
    SELL_SCREEN_OPTION_CHANGE        = "SELL_SCREEN_OPTION_CHANGE",
    INTERNAL_PAGE_MESSAGE            = "INTERNAL_PAGE_MESSAGE",
    TABLE_UPDATE                     = "TABLE_UPDATE",
    PIPELINE_TRIGGER                 = "PIPELINE_TRIGGER",
    SELL_SCREEN_PROMOTION_APPLICABLE = "SELL_SCREEN_PROMOTION_APPLICABLE",

    // Fulfilment Emitable Events
    FULFILMENT_OPT_IN        = "FULFILMENT_OPT_IN",
    FULFILMENT_OPTIONS       = "FULFILMENT_OPTIONS",
    FULFILMENT_ORDERS_SYNC   = "FULFILMENT_ORDERS_SYNC",
    FULFILMENT_ORDERS_CREATE = "FULFILMENT_ORDERS_CREATE",
    FULFILMENT_ORDERS_UPDATE = "FULFILMENT_ORDERS_UPDATE",
    FULFILMENT_ORDERS_CANCEL = "FULFILMENT_ORDERS_CANCEL",

    // Sale API events
    CREATE_SALE   = "CREATE_SALE",

    // Fulfilment Response Events
    FULFILMENT_GET_ORDER = "FULFILMENT_GET_ORDER",
}

export type SoundEvents = ToShopfront.AUDIO_REQUEST_PERMISSION | ToShopfront.AUDIO_PRELOAD | ToShopfront.AUDIO_PLAY;

export interface FromShopfrontReturns {
    READY           : void,
    REQUEST_SETTINGS: {
        logo       : null | string,
        description: null | string,
        url        : null | string,
    },
    REQUEST_BUTTONS      : Array<Button>,
    REQUEST_TABLE_COLUMNS: null | {
        headers: Array<{
            label : string,
            key   : string,
            weight: number,
        }>,
        body: Array<{
            [key: string]: string,
        }>,
        footer: {
            [key: string]: string,
        },
    },
    REQUEST_SELL_SCREEN_OPTIONS: Array<SellScreenOption>,
    CALLBACK: void,
    RESPONSE_CURRENT_SALE: {
        requestId: string,
        saleState: ShopfrontSaleState,
    },
    INTERNAL_PAGE_MESSAGE: void,
    REGISTER_CHANGED: void,
    RESPONSE_LOCATION: {
        requestId: string,
        register: string | null;
        outlet: string | null;
        user: string | null;
    },
    RESPONSE_AUDIO_REQUEST: {
        requestId: string;
        success: boolean;
        message?: string;
    },
    FORMAT_INTEGRATED_PRODUCT: FormatIntegratedProductEvent,
    REQUEST_CUSTOMER_LIST_OPTIONS: Array<SellScreenCustomerListOption>,
    REQUEST_SALE_KEYS: Array<SaleKey>,
    SALE_COMPLETE: void;
    UI_PIPELINE: Array<UIPipelineResponse>;
    PAYMENT_METHODS_ENABLED: Array<SellScreenPaymentMethod>,
    AUDIO_READY: void;
    AUDIO_PERMISSION_CHANGE: void;
    FULFILMENT_GET_ORDER: OrderDetails;
    FULFILMENT_VOID_ORDER: void;
    FULFILMENT_PROCESS_ORDER: void;
    FULFILMENT_ORDER_APPROVAL: void;
    FULFILMENT_ORDER_COLLECTED: void;
    FULFILMENT_ORDER_COMPLETED: void;
    RESPONSE_CREATE_SALE: {
        requestId: string;
        success: boolean;
        message?: string;
    };
    CHECK_GIFT_CODE_COLLISION: {
        code: string,
        collision: boolean,
        application: string
    };
}

export interface InternalPageMessageEvent {
    method   : "REQUEST_SETTINGS" | "REQUEST_SELL_SCREEN_OPTIONS" | "EXTERNAL_APPLICATION",
    url      : string,
    message  : unknown,
    reference: InternalMessageSource,
}

export interface RegisterChangedEvent {
    register: null | string;
    outlet  : null | string;
    user    : null | string;
}

export interface CheckGiftCardCodeCollisionEvent {
    code: string,
    collision: boolean,
    application: string
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

export type UIPipelineResponse = {
    name: string;
    content: string;
};

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
    READY                        : (event: RegisterChangedEvent) => MaybePromise<FromShopfrontReturns["READY"]>,
    REQUEST_SETTINGS             : () => MaybePromise<FromShopfrontReturns["REQUEST_SETTINGS"]>,
    REQUEST_BUTTONS              : (location: string, context: unknown) => MaybePromise<FromShopfrontReturns["REQUEST_BUTTONS"]>,
    REQUEST_TABLE_COLUMNS        : (location: string, data: unknown) => MaybePromise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>,
    REQUEST_SELL_SCREEN_OPTIONS  : () => MaybePromise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>,
    INTERNAL_PAGE_MESSAGE        : (event: InternalPageMessageEvent) => MaybePromise<FromShopfrontReturns["INTERNAL_PAGE_MESSAGE"]>,
    REGISTER_CHANGED             : (event: RegisterChangedEvent) => MaybePromise<FromShopfrontReturns["REGISTER_CHANGED"]>,
    CALLBACK                     : () => MaybePromise<FromShopfrontReturns["CALLBACK"]>,
    FORMAT_INTEGRATED_PRODUCT    : (event: FormatIntegratedProductEvent) => MaybePromise<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>,
    REQUEST_CUSTOMER_LIST_OPTIONS: () => MaybePromise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]>,
    REQUEST_SALE_KEYS            : () => MaybePromise<FromShopfrontReturns["REQUEST_SALE_KEYS"]>,
    SALE_COMPLETE                : (event: SaleCompletedEvent) => MaybePromise<FromShopfrontReturns["SALE_COMPLETE"]>,
    UI_PIPELINE                  : (event: Array<UIPipelineResponse>, context: UIPipelineContext) => MaybePromise<FromShopfrontReturns["UI_PIPELINE"]>,
    PAYMENT_METHODS_ENABLED      : (event: Array<SellScreenPaymentMethod>, context: PaymentMethodEnabledContext) => MaybePromise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]>,
    AUDIO_READY                  : () => MaybePromise<FromShopfrontReturns["AUDIO_READY"]>,
    AUDIO_PERMISSION_CHANGE      : (event: AudioPermissionChangeEvent) => MaybePromise<FromShopfrontReturns["AUDIO_PERMISSION_CHANGE"]>,
    FULFILMENT_GET_ORDER         : (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>,
    FULFILMENT_VOID_ORDER        : (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_VOID_ORDER"]>,
    FULFILMENT_PROCESS_ORDER     : (event: FulfilmentProcessEvent) => MaybePromise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]>,
    FULFILMENT_ORDER_APPROVAL    : (event: FulfilmentApprovalEvent) => MaybePromise<FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]>,
    FULFILMENT_ORDER_COLLECTED   : (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_ORDER_COLLECTED"]>,
    FULFILMENT_ORDER_COMPLETED   : (id: string) => MaybePromise<FromShopfrontReturns["FULFILMENT_ORDER_COMPLETED"]>,
    CHECK_GIFT_CODE_COLLISION    : (event: CheckGiftCardCodeCollisionEvent, context: unknown) => MaybePromise<FromShopfrontReturns["CHECK_GIFT_CODE_COLLISION"]>,
}

export interface FromShopfront {
    READY                        : Ready,
    REQUEST_SETTINGS             : RequestSettings,
    REQUEST_BUTTONS              : RequestButtons,
    REQUEST_TABLE_COLUMNS        : RequestTableColumns,
    REQUEST_SELL_SCREEN_OPTIONS  : RequestSellScreenOptions,
    CALLBACK                     : Callback,
    INTERNAL_PAGE_MESSAGE        : InternalPageMessage,
    REGISTER_CHANGED             : RegisterChanged,
    FORMAT_INTEGRATED_PRODUCT    : FormatIntegratedProduct,
    REQUEST_CUSTOMER_LIST_OPTIONS: RequestCustomerListOptions,
    SALE_COMPLETE                : SaleComplete,
    REQUEST_SALE_KEYS            : RequestSaleKeys,
    UI_PIPELINE                  : UIPipeline,
    PAYMENT_METHODS_ENABLED      : PaymentMethodsEnabled,
    AUDIO_READY                  : AudioReady,
    AUDIO_PERMISSION_CHANGE      : AudioPermissionChange,
    FULFILMENT_GET_ORDER         : FulfilmentGetOrder,
    FULFILMENT_VOID_ORDER        : FulfilmentVoidOrder,
    FULFILMENT_PROCESS_ORDER     : FulfilmentProcessOrder,
    FULFILMENT_ORDER_APPROVAL    : FulfilmentOrderApproval,
    FULFILMENT_ORDER_COLLECTED   : FulfilmentCollectOrder,
    FULFILMENT_ORDER_COMPLETED   : FulfilmentCompleteOrder,
    CHECK_GIFT_CODE_COLLISION    : CheckGiftCardCollision,
}

export const directShopfrontEvents = [
    "SALE_ADD_PRODUCT",
    "SALE_REMOVE_PRODUCT",
    "SALE_UPDATE_PRODUCTS",
    "SALE_CHANGE_QUANTITY",
    "SALE_ADD_CUSTOMER",
    "SALE_REMOVE_CUSTOMER",
    "SALE_CLEAR",
] as const;

export type DirectShopfrontEvent = typeof directShopfrontEvents[number];

export interface FromShopfrontInternal {
    CYCLE_KEY                : "CYCLE_KEY",
    LOCATION_CHANGED         : "LOCATION_CHANGED",
    RESPONSE_CURRENT_SALE    : "RESPONSE_CURRENT_SALE",
    RESPONSE_DATABASE_REQUEST: "RESPONSE_DATABASE_REQUEST",
    RESPONSE_LOCATION        : "RESPONSE_LOCATION",
    RESPONSE_OPTION          : "RESPONSE_OPTION",
    RESPONSE_AUDIO_REQUEST   : "RESPONSE_AUDIO_REQUEST",
    RESPONSE_SECURE_KEY      : "RESPONSE_SECURE_KEY",
    RESPONSE_CREATE_SALE     : "RESPONSE_CREATE_SALE",
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
