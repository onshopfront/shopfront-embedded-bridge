import {Ready} from "./Events/Ready";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";

export enum ToShopfront {
    READY      = "READY",
    SERIALIZED = "SERIALIZED",
}

export enum WithinApplication {

}

export interface FromShopfrontCallbacks {
    READY           : () => void,
    REQUEST_SETTINGS: () => { logo: null | string, description: null | string, url: null | string },
    REQUEST_BUTTONS : () => Array<Button>,
}

export interface FromShopfront {
    READY           : Ready;
    REQUEST_SETTINGS: RequestSettings,
    REQUEST_BUTTONS : RequestButtons,
}