import { Bridge } from "./Bridge";
import { FromShopfront } from "./ApplicationEvents";
import { Serializable } from "./Common/Serializable";
export declare class Application {
    protected bridge: Bridge;
    protected isReady: boolean;
    protected listeners: {
        [key in keyof FromShopfront]: Map<Function, FromShopfront[key]>;
    };
    constructor(bridge: Bridge);
    destroy(): void;
    protected handleEvent(event: keyof FromShopfront, data: {}): void;
    protected emit(event: keyof FromShopfront, data?: any): Promise<void> | undefined;
    addEventListener(event: keyof FromShopfront, callback: Function): void;
    removeEventListener(event: keyof FromShopfront, callback: () => void): void;
    send(item: Serializable<any>): void;
}
