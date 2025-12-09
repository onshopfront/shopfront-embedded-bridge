import { type FromShopfront, type FromShopfrontInternal, ToShopfront } from "./ApplicationEvents/ToShopfront.js";

export type ApplicationEventListener = (
    event: keyof FromShopfront | keyof FromShopfrontInternal,
    data: Record<string, unknown>,
    id: string
) => void;

export abstract class BaseBridge {
    public key: string;
    public url: URL;
    protected listeners: Array<ApplicationEventListener> = [];
    protected hasListener = false;
    protected target: Window | null = null;

    protected constructor(key: string, url: string | null) {
        this.key = key;

        if(!url) {
            this.url = new URL("communicator://javascript"); // This isn't used in this scenario
        } else if(url.split(".").length === 1) {
            this.url = new URL(`https://${url}.onshopfront.com`);
        } else {
            this.url = new URL(url);
        }
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
    public abstract sendMessage(type: ToShopfront, data?: unknown, id?: string): void;

    /**
     * Adds a listener for a Shopfront event
     */
    public abstract addEventListener(listener: ApplicationEventListener): void;

    /**
     * Removes a listener for a Shopfront event
     */
    public abstract removeEventListener(listener: ApplicationEventListener): void;
}
