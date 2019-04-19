import {Bridge} from "./Bridge";
import {FromShopfront, FromShopfrontCallbacks} from "./ApplicationEvents";
import {Ready} from "./Events/Ready";

export class Application {
    protected bridge : Bridge;
    protected isReady: boolean;
    protected listeners: {
        [key in keyof FromShopfront]: Map<Function, FromShopfront[key]>;
    } = {
        READY: new Map(),
    };

    constructor(bridge: Bridge) {
        this.bridge  = bridge;
        this.isReady = false;

        this.bridge.addEventListener(this.handleEvent);
    }

    public destroy() {
        this.bridge.destroy();
    }

    protected handleEvent(event: keyof FromShopfront, data: {}) {
        switch(event) {
            case "READY":
                this.ready();
                break;
        }
    }

    protected ready() {
        this.isReady = true;
        this.emit("READY");
    }

    protected emit(event: keyof FromShopfront, data: {} = {}) {
        for(let e of this.listeners[event].values()) {
            e.emit(data);
        }
    }

    public on(event: keyof FromShopfront, callback: Function) {
        let c = null;

        switch(event) {
            case "READY":
                c = new Ready(callback as FromShopfrontCallbacks["READY"]);
                break;
        }

        if(c === null) {
            throw new TypeError(`${event} has not been defined`);
        }

        this.listeners[event].set(callback, c);

        if(event === "READY" && this.isReady) {
            c.emit({});
        }
    }

    public off(event: keyof FromShopfront, callback: () => void) {
        this.listeners[event].delete(callback);
    }
}