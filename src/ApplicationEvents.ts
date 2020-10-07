import {Ready} from "./Events/Ready";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";
import {Callback} from "./Events/Callback";
import {RequestTableColumns} from "./Events/RequestTableColumns";
import {RequestSellScreenOptions, SellScreenOption} from "./Events/RequestSellScreenOptions";
import {ShopfrontSaleState} from "./APIs/CurrentSale/ShopfrontSaleState";
import {InternalPageMessage} from "./Events/InternalPageMessage";
import {InternalMessageSource} from "./APIs/InternalMessages/InternalMessageSource";
import {RegisterChanged} from "./Events/RegisterChanged";

export enum ToShopfront {
    READY                        = "READY",
    SERIALIZED                   = "SERIALIZED",
    RESPONSE_BUTTONS             = "RESPONSE_BUTTONS",
    RESPONSE_SETTINGS            = "RESPONSE_SETTINGS",
    RESPONSE_TABLE_COLUMNS       = "RESPONSE_TABLE_COLUMNS",
    RESPONSE_SELL_SCREEN_OPTIONS = "RESPONSE_SELL_SCREEN_OPTIONS",
    DOWNLOAD                     = "DOWNLOAD",
    LOAD                         = "LOAD",
    REQUEST_CURRENT_SALE         = "REQUEST_CURRENT_SALE",
    DATABASE_REQUEST             = "DATABASE_REQUEST",
    UNSUPPORTED_EVENT            = "UNSUPPORTED_EVENT",
    NOT_LISTENING_TO_EVENT       = "NOT_LISTENING_TO_EVENT",

    // Emitable Events
    SELL_SCREEN_OPTION_CHANGE = "SELL_SCREEN_OPTION_CHANGE",
    INTERNAL_PAGE_MESSAGE     = "INTERNAL_PAGE_MESSAGE",
    TABLE_UPDATE              = "TABLE_UPDATE",
}

export enum WithinApplication {

}

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
}

export interface InternalPageMessageEvent {
    method   : "REQUEST_SETTINGS" | "REQUEST_SELL_SCREEN_OPTIONS" | "EXTERNAL_APPLICATION",
    url      : string,
    message  : any,
    reference: InternalMessageSource,
}

export interface RegisterChangedEvent {
    register: null | string;
    outlet  : null | string;
    user    : null | string;
}

export interface FromShopfrontCallbacks {
    READY                      : (event: RegisterChangedEvent) => Promise<FromShopfrontReturns["READY"]>,
    REQUEST_SETTINGS           : () => Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>,
    REQUEST_BUTTONS            : () => Promise<FromShopfrontReturns["REQUEST_BUTTONS"]>,
    REQUEST_TABLE_COLUMNS      : () => Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>,
    REQUEST_SELL_SCREEN_OPTIONS: () => Promise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>,
    INTERNAL_PAGE_MESSAGE      : (event: InternalPageMessageEvent) => Promise<FromShopfrontReturns["INTERNAL_PAGE_MESSAGE"]>,
    REGISTER_CHANGED           : (event: RegisterChangedEvent) => Promise<FromShopfrontReturns["REGISTER_CHANGED"]>,
    CALLBACK                   : () => Promise<FromShopfrontReturns["CALLBACK"]>,
}

export interface FromShopfront {
    READY                      : Ready,
    REQUEST_SETTINGS           : RequestSettings,
    REQUEST_BUTTONS            : RequestButtons,
    REQUEST_TABLE_COLUMNS      : RequestTableColumns,
    REQUEST_SELL_SCREEN_OPTIONS: RequestSellScreenOptions,
    INTERNAL_PAGE_MESSAGE      : InternalPageMessage,
    REGISTER_CHANGED           : RegisterChanged,
    CALLBACK                   : Callback,
}

export interface FromShopfrontInternal {
    CYCLE_KEY                : "CYCLE_KEY",
    LOCATION_CHANGED         : "LOCATION_CHANGED",
    RESPONSE_CURRENT_SALE    : "RESPONSE_CURRENT_SALE",
    RESPONSE_DATABASE_REQUEST: "RESPONSE_DATABASE_REQUEST",
}
