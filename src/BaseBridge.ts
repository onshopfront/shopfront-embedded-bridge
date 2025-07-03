import * as ApplicationEvents from "./ApplicationEvents.js";
import { ApplicationEventListener } from "./Bridge.js";

export abstract class BaseBridge {
    public key: string;
    public url: URL;
    protected listeners: Array<ApplicationEventListener> = [];
    protected hasListener = false;

    protected constructor(key: string, url: string) {
        this.key = key;

        if(url.split(".").length === 1) {
            this.url = new URL(`https://${url}.onshopfront.com`);
        } else {
            this.url = new URL(url);
        }

        this.registerListeners();
        this.sendMessage(ApplicationEvents.ToShopfront.READY);
    }

    /**
     * Destroys the Bridge by unregistering all listeners
     */
    public abstract destroy(): void;

    /**
     * Register the event listener for any window messages
     */
    protected abstract registerListeners(): void;

    /**
     * Removes the window message event listener
     */
    protected abstract unregisterListeners(): void;

    /**
     * Sends an event to Shopfront
     */
    public abstract sendMessage(type: ApplicationEvents.ToShopfront, data?: unknown, id?: string): void;

    /**
     * Adds a listener for a Shopfront event
     */
    public abstract addEventListener(listener: ApplicationEventListener): void;

    /**
     * Removes a listener for a Shopfront event
     */
    public abstract removeEventListener(listener: ApplicationEventListener): void;
}
