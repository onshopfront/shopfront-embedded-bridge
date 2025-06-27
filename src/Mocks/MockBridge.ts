import * as ApplicationEvents from "../ApplicationEvents.js";
import { ApplicationEventListener, BridgeInterface } from "../Bridge.js";

export class MockBridge implements BridgeInterface {
    public key: string;
    public url: URL;
    protected listeners: Array<ApplicationEventListener> = [];
    protected hasListener = false;
    protected isReady = false;

    constructor(key: string, url: string) {
        this.key = key;

        if(url.split(".").length === 1) {
            this.url = new URL(`https://${url}.onshopfront.com`);
        } else {
            this.url = new URL(url);
        }
    }

    /**
     * @inheritDoc
     */
    public destroy(): void {
        this.listeners = [];
    }

    /**
     * @inheritDoc
     */
    public sendMessage(type: ApplicationEvents.ToShopfront, data?: unknown, id?: string): void {
        if(type === ApplicationEvents.ToShopfront.READY) {
            if(typeof data !== "undefined") {
                throw new TypeError("The `data` parameter must be undefined when requesting ready state");
            }

            if(this.isReady) {
                throw new Error("Shopfront is already ready");
            }

            const listeners = this.listeners;

            // We can fire off a READY event straight away
            for(let i = 0, l = listeners.length; i < l; i++) {
                listeners[i](type, {
                    key     : "signing-key-uuid",
                    outlet  : "outlet-uuid",
                    register: "register-uuid",
                }, id as string);
            }

            return;
        }

        // No need to do anything
    }

    /**
     * @inheritDoc
     */
    public addEventListener(listener: ApplicationEventListener): void {
        if(this.listeners.includes(listener)) {
            throw new Error("The listener provided is already registered");
        }

        this.listeners.push(listener);

        // If this is a READY event listener, we can fire off a Ready event immediately
        if(!this.hasListener) {
            this.sendMessage(ApplicationEvents.ToShopfront.READY);
            this.hasListener = true;
        }
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(listener: ApplicationEventListener): void {
        const index = this.listeners.indexOf(listener);

        if(index === -1) {
            return;
        }

        this.listeners = [
            ...this.listeners.slice(0, index),
            ...this.listeners.slice(index + 1),
        ];
    }
}
