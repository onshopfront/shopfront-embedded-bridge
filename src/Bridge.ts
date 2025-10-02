import { Application } from "./Application.js";
import * as ApplicationEvents from "./ApplicationEvents.js";
import { type ApplicationEventListener, BaseBridge } from "./BaseBridge.js";

interface FrameApplicationOptions {
    id: string; // The Client ID
    vendor: string; // The Vendor's URL
    communicator?: "frame";
}

interface JavaScriptApplicationOptions {
    id: string; // The Client ID
    communicator: "javascript";
}

type ApplicationOptions = FrameApplicationOptions | JavaScriptApplicationOptions;

type JavaScriptSendMessageCallback = (message: {
    key: string;
    type: string;
    data: unknown;
    id?: string;
}) => void;

export type JavaScriptReceiveMessageCallback = (
    type: keyof ApplicationEvents.FromShopfront | keyof ApplicationEvents.FromShopfrontInternal,
    data: Record<string, unknown>,
    id: string
) => void;

export interface JavaScriptCommunicatorExports {
    execute: () => void;
    registerSendMessage: (callback: JavaScriptSendMessageCallback) => void;
    onReceiveMessage: JavaScriptReceiveMessageCallback;
}

export class Bridge extends BaseBridge {
    /**
     * A static method for instantiating an Application
     */
    public static createApplication(options: ApplicationOptions): Application {
        if(typeof options.id === "undefined") {
            throw new TypeError("You must specify the ID for the application");
        }

        if(options.communicator !== "javascript" && typeof options.vendor === "undefined") {
            throw new TypeError("You must specify the Vendor for the application");
        }

        return new Application(
            new Bridge(
                options.id,
                options.communicator === "javascript" ? null : options.vendor,
                options.communicator ?? "frame"
            )
        );
    }

    protected javascriptIsReady = false;
    protected javascriptSendMessageCallback?: JavaScriptSendMessageCallback;

    /**
     * The JavaScript communicator instance
     */
    public get communicator(): JavaScriptCommunicatorExports {
        if(this.communicateVia !== "javascript") {
            throw new Error("The communicator can only be accessed when communicating via JavaScript");
        }

        return {
            /**
             * This is called when the application is ready to communicate, essentially this is the same as the READY
             * event when calling through the frame
             */
            execute: () => {
                // This is the equivalent of calling the ready event
                this.javascriptIsReady = true;
                this.sendMessageViaJavaScript(ApplicationEvents.ToShopfront.READY);
            },
            registerSendMessage: (callback) => {
                this.javascriptSendMessageCallback = callback;
            },
            onReceiveMessage: (type, data, id) => {
                this.emitToListeners(type, data, id);
            },
        };
    }

    constructor(key: string, url: string | null, protected communicateVia: "frame" | "javascript") {
        if(communicateVia === "frame" && window.parent === window) {
            throw new Error("The bridge has not been initialised within a frame");
        }

        if(communicateVia === "frame" && url === null) {
            throw new Error("The subdomain of the vendor has not been specified");
        }

        if(communicateVia === "javascript" && url !== null) {
            throw new Error("You cannot specify a subdomain when using the JavaScript communicator");
        }

        super(key, url);

        this.registerListeners();
        this.sendMessage(ApplicationEvents.ToShopfront.READY);
    }

    /**
     * @inheritDoc
     */
    public destroy(): void {
        this.unregisterListeners();
        this.listeners = [];
    }

    /**
     * @inheritDoc
     */
    protected registerListeners(): void {
        if(this.communicateVia === "javascript") {
            return;
        }

        window.addEventListener("message", this.handleMessageFromFrame, false);
    }

    /**
     * @inheritDoc
     */
    protected unregisterListeners(): void {
        if(this.communicateVia === "javascript") {
            return;
        }

        window.removeEventListener("message", this.handleMessageFromFrame);
    }

    /**
     * Emit an event to the currently registered listeners
     */
    protected emitToListeners(
        type: keyof ApplicationEvents.FromShopfront | keyof ApplicationEvents.FromShopfrontInternal,
        data: Record<string, unknown>,
        id: string
    ): void {
        const listeners = this.listeners;

        for(let i = 0, l = listeners.length; i < l; i++) {
            listeners[i](type, data, id);
        }
    }

    /**
     * Receive a message from the application frame and distribute it to the correct listener
     */
    protected handleMessageFromFrame = (event: MessageEvent): void => {
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

        if(typeof event.data.origins === "undefined") {
            return;
        } else if(event.data.origins.from !== this.url.origin || event.data.origins.to !== window.location.origin) {
            return;
        }

        if(this.target === null) {
            if(event.data.type !== "READY") {
                return;
            }

            if(window.parent !== event.source) {
                // Not from the parent frame
                return;
            }

            this.target = event.source;
        } else {
            if(event.source !== this.target) {
                // Not from the source we want
                return;
            }
        }

        // Emit the event
        this.emitToListeners(event.data.type, event.data.data, event.data.id);
    };

    /**
     * Send a message via the JavaScript communicator
     */
    protected sendMessageViaJavaScript(type: ApplicationEvents.ToShopfront, data?: unknown, id?: string): void {
        if(!this.javascriptIsReady && type === ApplicationEvents.ToShopfront.READY) {
            // The ready event is automatically called due to the application frame needing it
            return;
        }

        if(!this.javascriptIsReady) {
            throw new Error("We haven't received notification from Shopfront that the application is ready yet");
        }

        if(typeof this.javascriptSendMessageCallback === "undefined") {
            throw new Error("Attempting to send a message to Shopfront before the module has been imported");
        }

        this.javascriptSendMessageCallback({
            key: this.key,
            type,
            data,
            id,
        });
    }

    /**
     * @inheritDoc
     */
    public sendMessage(type: ApplicationEvents.ToShopfront, data?: unknown, id?: string): void {
        if(this.communicateVia === "javascript") {
            return this.sendMessageViaJavaScript(type, data, id);
        }

        if(type === ApplicationEvents.ToShopfront.READY) {
            if(typeof data !== "undefined") {
                throw new TypeError("The `data` parameter must be undefined when requesting ready state");
            }

            if(this.target !== null) {
                throw new Error("Shopfront is already ready");
            }

            window.parent.postMessage({
                type,
                origins: {
                    to  : this.url.origin,
                    from: window.location.origin,
                },
                key: this.key,
            }, /* can't use this because of sandbox: this.url.origin */ "*");

            return;
        }

        if(this.target === null) {
            throw new Error("Shopfront is not ready");
        }

        this.target.parent.postMessage({
            type,
            origins: {
                to  : this.url.origin,
                from: window.location.origin,
            },
            key: this.key,
            id,
            data,
        }, "*" /* can't use this because of sandbox: this.url.origin */);
    }

    /**
     * @inheritDoc
     */
    public addEventListener(listener: ApplicationEventListener): void {
        if(this.listeners.includes(listener)) {
            throw new Error("The listener provided is already registered");
        }

        this.listeners.push(listener);

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
