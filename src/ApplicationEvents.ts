import {Ready} from "./Events/Ready";

export enum ToShopfront {
    READY = "READY",
}

export enum WithinApplication {

}

export interface FromShopfrontCallbacks {
    READY: () => void,
}

export interface FromShopfront {
    READY: Ready;
}