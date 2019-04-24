import {Bridge} from "./Bridge";
import {FromShopfront, FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "./ApplicationEvents";
import {Ready} from "./Events/Ready";
import {Serializable} from "./Common/Serializable";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";

export class Application {
    protected bridge   : Bridge;
    protected isReady  : boolean;
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

    protected emit(event: keyof FromShopfront, data: any = {}) {
        let results = [];

        for(let e of this.listeners[event].values()) {
            results.push(e.emit(data) as Promise<FromShopfrontReturns[typeof event]>);
        }

        // Respond if necessary
        switch(event) {
            case "REQUEST_BUTTONS":
                results = results as unknown as Array<Promise<FromShopfrontReturns["REQUEST_BUTTONS"]>>;

                return Promise.all(results)
                    .then((res: Array<Array<Button>>) => {
                        return RequestButtons.respond(this.bridge, res.flat(), data.id);
                    });
            case "REQUEST_SETTINGS":
                results = results as unknown as Array<Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_SETTINGS"]>) => {
                        return RequestSettings.respond(this.bridge, res.flat(), data.id);
                    });
        }
    }

    public addEventListener(event: keyof FromShopfront, callback: Function) {
        let c = null;

        switch(event) {
            case "READY":
                c = new Ready(callback as FromShopfrontCallbacks["READY"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_SETTINGS":
                c = new RequestSettings(callback as FromShopfrontCallbacks["REQUEST_SETTINGS"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_BUTTONS":
                c = new RequestButtons(callback as FromShopfrontCallbacks["REQUEST_BUTTONS"]);
                this.listeners[event].set(callback, c);
                break;
        }

        if(c === null) {
            throw new TypeError(`${event} has not been defined`);
        }

        if(event === "READY" && this.isReady) {
            c = c as Ready;
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