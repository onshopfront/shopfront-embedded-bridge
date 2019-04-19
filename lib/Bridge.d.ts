import { Application } from "./Application";
import * as ApplicationEvents from "./ApplicationEvents";
interface ApplicationOptions {
    id: string;
    vendor: string;
}
interface ApplicationEventListener {
    (event: keyof ApplicationEvents.FromShopfront, data: {}): void;
}
export declare class Bridge {
    static createApplication(options: ApplicationOptions): Application;
    protected key: string;
    protected url: URL;
    protected listeners: Array<ApplicationEventListener>;
    protected hasListener: boolean;
    protected target: Window | null;
    constructor(key: string, url: string);
    destroy(): void;
    protected registerListeners(): void;
    protected unregisterListeners(): void;
    protected handleMessage(event: MessageEvent): void;
    sendMessage(type: ApplicationEvents.ToShopfront, data?: {}): void;
    addEventListener(listener: ApplicationEventListener): void;
    removeEventListener(listener: ApplicationEventListener): void;
}
export {};
