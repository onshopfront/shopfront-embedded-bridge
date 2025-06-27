import { MaybePromise } from "../Utilities/MiscTypes.js";

export class EventEmitter {
    protected supportedEvents: Array<string> = [];
    private listeners: Record<string, Array<(...args: Array<unknown>) => MaybePromise<unknown>>> = {};

    /**
     * Registers an event listener
     * @param event
     * @param callback
     */
    public addEventListener(event: string, callback: (...args: Array<unknown>) => MaybePromise<unknown>): void {
        if(!this.supportedEvents.includes(event)) {
            throw new TypeError(`${event} is not a supported event`);
        }

        if(typeof this.listeners[event] === "undefined") {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    /**
     * Removes an event listener
     * @param event
     * @param callback
     */
    public removeEventListener(event: string, callback: (...args: Array<unknown>) => MaybePromise<unknown>): void {
        if(!this.supportedEvents.includes(event)) {
            throw new TypeError(`${event} is not a supported event`);
        }

        if(typeof this.listeners[event] === "undefined") {
            return;
        }

        const index = this.listeners[event].indexOf(callback);

        if(index === -1) {
            return;
        }

        this.listeners[event] = [
            ...this.listeners[event].slice(0, index),
            ...this.listeners[event].slice(index + 1),
        ];
    }

    /**
     * Invokes all callbacks listening to the event
     * @param event
     * @param args
     */
    protected async emit(event: string, ...args: Array<unknown>): Promise<Array<unknown>> {
        if(typeof this.listeners[event] === "undefined") {
            return Promise.resolve([]);
        }

        const events: Array<MaybePromise<unknown>> = [];

        for(let i = 0, l = this.listeners[event].length; i < l; i++) {
            events.push(this.listeners[event][i](...args));
        }

        return Promise.all(events);
    }
}
