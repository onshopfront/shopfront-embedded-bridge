import {Ready} from "./Events/Ready";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";
import {Callback} from "./Events/Callback";
import {RequestTableColumns} from "./Events/RequestTableColumns";

export enum ToShopfront {
    READY                  = "READY",
    SERIALIZED             = "SERIALIZED",
    RESPONSE_BUTTONS       = "RESPONSE_BUTTONS",
    RESPONSE_SETTINGS      = "RESPONSE_SETTINGS",
    RESPONSE_TABLE_COLUMNS = "RESPONSE_TABLE_COLUMNS",
    DOWNLOAD               = "DOWNLOAD",
    LOAD                   = "LOAD",
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
        header: Array<{
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
    CALLBACK: void,
}

export interface FromShopfrontCallbacks {
    READY                : () => Promise<FromShopfrontReturns["READY"]>,
    REQUEST_SETTINGS     : () => Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>,
    REQUEST_BUTTONS      : () => Promise<FromShopfrontReturns["REQUEST_BUTTONS"]>,
    REQUEST_TABLE_COLUMNS: () => Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>,
    CALLBACK             : () => Promise<FromShopfrontReturns["CALLBACK"]>,
}

export interface FromShopfront {
    READY                : Ready,
    REQUEST_SETTINGS     : RequestSettings,
    REQUEST_BUTTONS      : RequestButtons,
    REQUEST_TABLE_COLUMNS: RequestTableColumns,
    CALLBACK             : Callback,
}

export interface FromShopfrontInternal {
    CYCLE_KEY       : "CYCLE_KEY",
    LOCATION_CHANGED: "LOCATION_CHANGED",
}
