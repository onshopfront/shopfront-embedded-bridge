import {Application} from "./Application";
import * as ApplicationEvents from "./ApplicationEvents";

interface ApplicationOptions {
    id    : string; // The Client ID
    vendor: string; // The Vendor's URL
}

interface ApplicationEventListener {
    (event: keyof ApplicationEvents.FromShopfront, data: {}): void;
}

export class Bridge {
    public static createApplication(options: ApplicationOptions): Application {
        if(typeof options.id === "undefined") {
            throw new TypeError("You must specify the ID for the application");
        }

        if(typeof options.vendor === "undefined") {
            throw new TypeError("You must specify the Vendor for the application");
        }

        return new Application(new Bridge(options.id, options.vendor));
    }

    protected key        : string;
    protected url        : URL;
    protected listeners  : Array<ApplicationEventListener> = [];
    protected hasListener: boolean = false;
    protected target     : Window | null = null;

    constructor(key: string, url: string) {
        if(window.parent === window) {
            throw new Error("The bridge has not been initialised within a frame");
        }

        this.key = key;

        if(url.split('.').length === 1) {
            this.url = new URL(`https://${url}.onshopfront.com`);
        } else {
            this.url = new URL(url);
        }

        this.registerListeners();
        this.sendMessage(ApplicationEvents.ToShopfront.READY);
    }

    public destroy() {
        this.unregisterListeners();
        this.listeners = [];
    }

    protected registerListeners() {
        window.addEventListener("message", this.handleMessage, false);
    }

    protected unregisterListeners() {
        window.removeEventListener("message", this.handleMessage);
    }

    protected handleMessage(event: MessageEvent) {
        if(event.origin !== this.url.origin) {
            return;
        }

        if(typeof event.data !== "object" || event.data === null) {
            return;
        }

        if(typeof event.data.type !== "string") {
            return;
        }

        if(event.data.from !== "ShopfrontApplicationAgent") {
            return;
        }

        if(this.target === null) {
            if(window.parent !== event.source) {
                // Not from the parent frame
                return;
            }
        } else {
            if(event.source !== this.target) {
                // Not from the source we want
                return;
            }
        }

        // Emit the event
        for(let i = 0, l = this.listeners.length; i < l; i++) {
            this.listeners[i](event.data.type, event.data.data);
        }
    }

    public sendMessage(type: ApplicationEvents.ToShopfront, data?: {}) {
        if(type === ApplicationEvents.ToShopfront.READY) {
            if(typeof data !== "undefined") {
                throw new TypeError("The `data` parameter must be undefined when requesting ready state");
            }

            if(this.target !== null) {
                throw new Error("Shopfront is already ready");
            }

            window.parent.postMessage({
                type,
                origin: this.url.origin,
            }, this.url.origin);

            return;
        }

        if(this.target === null) {
            throw new Error("Shopfront is not ready");
        }

        this.target.parent.postMessage({
            type,
            origin: this.url.origin,
            data
        }, this.url.origin);
    }

    public addEventListener(listener: ApplicationEventListener) {
        if(this.listeners.includes(listener)) {
            throw new Error("The listener provided is already registered");
        }

        this.listeners.push(listener);

        if(!this.hasListener) {
            this.sendMessage(ApplicationEvents.ToShopfront.READY);
            this.hasListener = true;
        }
    }

    public removeEventListener(listener: ApplicationEventListener) {
        let index = this.listeners.indexOf(listener);

        if(index === -1) {
            return;
        }

        this.listeners = [
            ...this.listeners.slice(0, index),
            ...this.listeners.slice(index + 1),
        ];
    }
}