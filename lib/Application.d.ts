import { Bridge } from "./Bridge";
import { FromShopfront } from "./ApplicationEvents";
export declare class Application {
    protected bridge: Bridge;
    protected isReady: boolean;
    protected listeners: {
        [key in keyof FromShopfront]: Map<Function, FromShopfront[key]>;
    };
    constructor(bridge: Bridge);
    destroy(): void;
    protected handleEvent(event: keyof FromShopfront, data: {}): void;
    protected ready(): void;
    protected emit(event: keyof FromShopfront, data?: {}): void;
    on(event: keyof FromShopfront, callback: Function): void;
    off(event: keyof FromShopfront, callback: () => void): void;
}
