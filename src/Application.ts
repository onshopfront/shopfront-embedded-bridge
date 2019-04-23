import {Bridge} from "./Bridge";
import {FromShopfront, FromShopfrontCallbacks, ToShopfront} from "./ApplicationEvents";
import {Ready} from "./Events/Ready";
import {Serializable} from "./Common/Serializable";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";

export class Application {
    protected bridge : Bridge;
    protected isReady: boolean;
    protected listeners: {
        [key in keyof FromShopfront]: Map<Function, FromShopfront[key]>;
    } = {
        READY           : new Map(),
        REQUEST_SETTINGS: new Map(),
        REQUEST_BUTTONS : new Map(),
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
        if(event === "READY") {
            this.isReady = true;
        }

        this.emit(event, data);
    }

    protected emit(event: keyof FromShopfront, data: {} = {}) {
        for(let e of this.listeners[event].values()) {
            e.emit(data);
        }
    }

    public addEventListener(event: keyof FromShopfront, callback: Function) {
        let c = null;

        switch(event) {
            case "READY":
                c = new Ready(callback as FromShopfrontCallbacks["READY"]);
                break;
            case "REQUEST_SETTINGS":
                c = new RequestSettings(callback as FromShopfrontCallbacks["REQUEST_SETTINGS"]);
                break;
            case "REQUEST_BUTTONS":
                c = new RequestButtons(callback as FromShopfrontCallbacks["REQUEST_BUTTONS"]);
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

    public removeEventListener(event: keyof FromShopfront, callback: () => void) {
        this.listeners[event].delete(callback);
    }

    public send(item: Serializable<any>) {
        if(item instanceof Button) {
            throw new TypeError("You cannot send Buttons to Shopfront without Shopfront requesting them");
        }

        const serialized = item.serialize();

        this.bridge.sendMessage(ToShopfront.SERIALIZED, serialized);
    }
}