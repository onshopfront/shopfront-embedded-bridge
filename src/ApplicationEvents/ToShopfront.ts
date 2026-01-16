import { Button } from "../Actions/Button.js";
import { SaleKey } from "../Actions/SaleKey.js";
import { type OrderDetails } from "../APIs/Fulfilment/FulfilmentTypes.js";
import { InternalMessageSource } from "../APIs/InternalMessages/InternalMessageSource.js";
import { Sale, type ShopfrontSaleState } from "../APIs/Sale/index.js";
import { AudioPermissionChange } from "../Events/AudioPermissionChange.js";
import { AudioReady } from "../Events/AudioReady.js";
import { Callback } from "../Events/Callback.js";
import { FormatIntegratedProduct, type FormattedSaleProduct } from "../Events/FormatIntegratedProduct.js";
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
import { RequestCustomerListOptions, type SellScreenCustomerListOption } from "../Events/RequestCustomerListOptions.js";
import { RequestSaleKeys } from "../Events/RequestSaleKeys.js";
import { RequestSellScreenOptions, type SellScreenOption } from "../Events/RequestSellScreenOptions.js";
import { RequestSettings } from "../Events/RequestSettings.js";
import { RequestTableColumns } from "../Events/RequestTableColumns.js";
import { type CompletedSale, SaleComplete } from "../Events/SaleComplete.js";
import type { SalePreFinishPipeline } from "../Events/SalePreFinishPipeline.js";
import { UIPipeline } from "../Events/UIPipeline.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";

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

export type SoundEvents = ToShopfront.AUDIO_REQUEST_PERMISSION | ToShopfront.AUDIO_PRELOAD | ToShopfront.AUDIO_PLAY;

export interface UIPipelineData {
    name: string;
    content: string;
}

export interface RequestSettingsResponse {
    logo?: string;
    description?: string;
    url?: string;
    html?: string;
}

export type RequestButtonsResponse = Array<Button>;

export type RequestTableColumnsResponse = null | {
    headers: Array<{
        label: string;
        key: string;
        weight: number;
    }>;
    body: Array<Record<string, string>>;
    footer: Record<string, string>;
};

export type RequestSellScreenOptionsResponse = Array<SellScreenOption>;

export type FormatIntegratedProductResponse = FormatIntegratedProductEvent;

export type RequestCustomerListOptionsResponse = Array<SellScreenCustomerListOption>;

export type RequestSaleKeysResponse = Array<SaleKey>;

export type UIPipelineResponse = Array<UIPipelineData>;

export type PaymentMethodsEnabledResponse = Array<SellScreenPaymentMethod>;

export type FulfilmentGetOrderResponse = OrderDetails;

export interface GiftCardCodeCheckResponse {
    code: string;
    message: string | null;
}

export type SalePreFinishPipelineResponse = ShopfrontSaleState | false;

interface InternalShopfrontResponse {
    requestId: string;
}

export interface ResponseCurrentSaleResponse extends InternalShopfrontResponse {
    saleState: ShopfrontSaleState;
}

export interface ResponseLocationResponse extends InternalShopfrontResponse {
    register: string | null;
    outlet: string | null;
    user: string | null;
}

interface GenericRequestResponse extends InternalShopfrontResponse {
    success: boolean;
    message?: string;
}

export type ResponseAudioRequestResponse = GenericRequestResponse;

export type ResponseCreateSaleResponse = GenericRequestResponse;

export interface FromShopfrontResponse {
    READY: unknown;
    REQUEST_SETTINGS: RequestSettingsResponse;
    REQUEST_BUTTONS: RequestButtonsResponse;
    REQUEST_TABLE_COLUMNS: RequestTableColumnsResponse;
    REQUEST_SELL_SCREEN_OPTIONS: RequestSellScreenOptionsResponse;
    CALLBACK: unknown;
    RESPONSE_CURRENT_SALE: ResponseCurrentSaleResponse;
    INTERNAL_PAGE_MESSAGE: unknown;
    REGISTER_CHANGED: unknown;
    RESPONSE_LOCATION: ResponseLocationResponse;
    RESPONSE_AUDIO_REQUEST: ResponseAudioRequestResponse;
    FORMAT_INTEGRATED_PRODUCT: FormatIntegratedProductResponse;
    REQUEST_CUSTOMER_LIST_OPTIONS: RequestCustomerListOptionsResponse;
    REQUEST_SALE_KEYS: RequestSaleKeysResponse;
    SALE_COMPLETE: unknown;
    UI_PIPELINE: UIPipelineResponse;
    PAYMENT_METHODS_ENABLED: PaymentMethodsEnabledResponse;
    AUDIO_READY: unknown;
    AUDIO_PERMISSION_CHANGE: unknown;
    FULFILMENT_GET_ORDER: FulfilmentGetOrderResponse;
    FULFILMENT_VOID_ORDER: unknown;
    FULFILMENT_PROCESS_ORDER: unknown;
    FULFILMENT_ORDER_APPROVAL: unknown;
    FULFILMENT_ORDER_COLLECTED: unknown;
    FULFILMENT_ORDER_COMPLETED: unknown;
    RESPONSE_CREATE_SALE: ResponseCreateSaleResponse;
    GIFT_CARD_CODE_CHECK: GiftCardCodeCheckResponse;
    SALE_PRE_FINISH_PIPELINE: SalePreFinishPipelineResponse;
}

export interface InternalPageMessageEvent {
    method: "REQUEST_SETTINGS" | "REQUEST_SELL_SCREEN_OPTIONS" | "PAYMENT_API" | "EXTERNAL_APPLICATION";
    url: string;
    message: unknown;
    reference: InternalMessageSource;
}

export interface ReadyEvent {
    register: null | string;
    outlet: null | string;
    vendor: string;
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

export type SalePreFinishPipelineEvent = ShopfrontSaleState | false;

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

export type UIPipelineEvent = Array<UIPipelineData>;

export interface UIPipelineBaseContext {
    location: string;
}

export interface UIPipelineContext extends UIPipelineBaseContext {
    trigger?: () => void;
}

export type PaymentMethodsEnabledEvent = Array<SellScreenPaymentMethod>;

export interface PaymentMethodEnabledContext {
    register: string;
    customer: false | {
        uuid: string;
    };
}

export interface SalePreFinishPipelineContext {
    user: string | false;
    register: string;
}

export interface FromShopfrontCallbacks {
    READY: (event: ReadyEvent) => MaybePromise<FromShopfrontResponse["READY"]>;
    REQUEST_SETTINGS: () => MaybePromise<FromShopfrontResponse["REQUEST_SETTINGS"]>;
    REQUEST_BUTTONS: (location: string, context: unknown) => MaybePromise<FromShopfrontResponse["REQUEST_BUTTONS"]>;
    REQUEST_TABLE_COLUMNS: (
        location: string,
        data: unknown
    ) => MaybePromise<FromShopfrontResponse["REQUEST_TABLE_COLUMNS"]>;
    REQUEST_SELL_SCREEN_OPTIONS: () => MaybePromise<FromShopfrontResponse["REQUEST_SELL_SCREEN_OPTIONS"]>;
    INTERNAL_PAGE_MESSAGE: (
        event: InternalPageMessageEvent
    ) => MaybePromise<FromShopfrontResponse["INTERNAL_PAGE_MESSAGE"]>;
    REGISTER_CHANGED: (event: RegisterChangedEvent) => MaybePromise<FromShopfrontResponse["REGISTER_CHANGED"]>;
    CALLBACK: () => MaybePromise<FromShopfrontResponse["CALLBACK"]>;
    FORMAT_INTEGRATED_PRODUCT: (
        event: FormatIntegratedProductEvent
    ) => MaybePromise<FromShopfrontResponse["FORMAT_INTEGRATED_PRODUCT"]>;
    REQUEST_CUSTOMER_LIST_OPTIONS: () => MaybePromise<FromShopfrontResponse["REQUEST_CUSTOMER_LIST_OPTIONS"]>;
    REQUEST_SALE_KEYS: () => MaybePromise<FromShopfrontResponse["REQUEST_SALE_KEYS"]>;
    SALE_COMPLETE: (event: SaleCompletedEvent) => MaybePromise<FromShopfrontResponse["SALE_COMPLETE"]>;
    UI_PIPELINE: (
        event: UIPipelineEvent,
        context: UIPipelineContext
    ) => MaybePromise<FromShopfrontResponse["UI_PIPELINE"]>;
    PAYMENT_METHODS_ENABLED: (
        event: PaymentMethodsEnabledEvent,
        context: PaymentMethodEnabledContext
    ) => MaybePromise<FromShopfrontResponse["PAYMENT_METHODS_ENABLED"]>;
    AUDIO_READY: () => MaybePromise<FromShopfrontResponse["AUDIO_READY"]>;
    AUDIO_PERMISSION_CHANGE: (
        event: AudioPermissionChangeEvent
    ) => MaybePromise<FromShopfrontResponse["AUDIO_PERMISSION_CHANGE"]>;
    FULFILMENT_GET_ORDER: (id: string) => MaybePromise<FromShopfrontResponse["FULFILMENT_GET_ORDER"]>;
    FULFILMENT_VOID_ORDER: (id: string) => MaybePromise<FromShopfrontResponse["FULFILMENT_VOID_ORDER"]>;
    FULFILMENT_PROCESS_ORDER: (
        event: FulfilmentProcessEvent
    ) => MaybePromise<FromShopfrontResponse["FULFILMENT_PROCESS_ORDER"]>;
    FULFILMENT_ORDER_APPROVAL: (
        event: FulfilmentApprovalEvent
    ) => MaybePromise<FromShopfrontResponse["FULFILMENT_ORDER_APPROVAL"]>;
    FULFILMENT_ORDER_COLLECTED: (id: string) => MaybePromise<FromShopfrontResponse["FULFILMENT_ORDER_COLLECTED"]>;
    FULFILMENT_ORDER_COMPLETED: (id: string) => MaybePromise<FromShopfrontResponse["FULFILMENT_ORDER_COMPLETED"]>;
    GIFT_CARD_CODE_CHECK: (
        event: GiftCardCodeCheckEvent,
        context: unknown
    ) => MaybePromise<FromShopfrontResponse["GIFT_CARD_CODE_CHECK"]>;
    SALE_PRE_FINISH_PIPELINE: (
        event: SalePreFinishPipelineEvent,
        context: SalePreFinishPipelineContext
    ) => MaybePromise<FromShopfrontResponse["SALE_PRE_FINISH_PIPELINE"]>;
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
    SALE_PRE_FINISH_PIPELINE: SalePreFinishPipeline;
}

export type ListenableFromShopfrontEvent = keyof Omit<FromShopfront, "CALLBACK">;

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
