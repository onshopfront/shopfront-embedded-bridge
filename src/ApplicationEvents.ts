import {Ready} from "./Events/Ready";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";
import {Callback} from "./Events/Callback";

export enum ToShopfront {
    READY             = "READY",
    SERIALIZED        = "SERIALIZED",
    RESPONSE_BUTTONS  = "RESPONSE_BUTTONS",
    RESPONSE_SETTINGS = "RESPONSE_SETTINGS",
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
    REQUEST_BUTTONS: Array<Button>,
    CALLBACK       : void,
}

export interface FromShopfrontCallbacks {
    READY           : () => Promise<FromShopfrontReturns["READY"]>,
    REQUEST_SETTINGS: () => Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>,
    REQUEST_BUTTONS : () => Promise<FromShopfrontReturns["REQUEST_BUTTONS"]>,
    CALLBACK        : () => Promise<FromShopfrontReturns["CALLBACK"]>,
}

export interface FromShopfront {
    READY           : Ready,
    REQUEST_SETTINGS: RequestSettings,
    REQUEST_BUTTONS : RequestButtons,
    CALLBACK        : Callback,
}

export interface FromShopfrontInternal {
    CYCLE_KEY: "CYCLE_KEY",
}