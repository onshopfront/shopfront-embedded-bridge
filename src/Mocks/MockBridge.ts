import * as ApplicationEvents from "../ApplicationEvents.js";
import { BaseBridge } from "../BaseBridge.js";
import { type ApplicationEventListener } from "../Bridge.js";

export class MockBridge extends BaseBridge {
    protected isReady = false;

    constructor(key: string, url: string) {
        super(key, url);

        this.registerListeners();
        this.sendMessage(ApplicationEvents.ToShopfront.READY);
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
    protected registerListeners(): void {
        /* Do nothing */
    }

    /**
     * @inheritDoc
     */
    protected unregisterListeners(): void {
        /* Do nothing */
    }

    /**
     * @inheritDoc
     */
    public async sendMessage(type: ApplicationEvents.ToShopfront, data?: unknown, id?: string): Promise<void> {
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
