import { Ready } from "./Events/Ready";
export declare enum ToShopfront {
    READY = "READY"
}
export declare enum WithinApplication {
}
export interface FromShopfrontCallbacks {
    READY: () => void;
}
export interface FromShopfront {
    READY: Ready;
}
