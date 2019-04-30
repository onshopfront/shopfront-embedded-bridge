import {Bridge} from "./Bridge";
import {FromShopfront, FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "./ApplicationEvents";
import {Ready} from "./Events/Ready";
import {Serializable} from "./Common/Serializable";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";
import ActionEventRegistrar from "./Utilities/ActionEventRegistrar";

export class Application {
    protected bridge   : Bridge;
    protected isReady  : boolean;
    protected listeners: {
        [key in keyof FromShopfront]: Map<Function, FromShopfront[key]>;
    } = {
        READY           : new Map(),
        REQUEST_SETTINGS: new Map(),
        REQUEST_BUTTONS : new Map(),
        CALLBACK        : new Map(),
    };

    constructor(bridge: Bridge) {
        this.bridge  = bridge;
        this.isReady = false;

        this.bridge.addEventListener(this.handleEvent);
    }

    public destroy() {
        this.bridge.destroy();
    }

    protected handleEvent = (event: keyof FromShopfront, data: any, id: string) => {
        if(event === "READY") {
            this.isReady = true;
        }

        if(event === "CALLBACK") {
            this.handleEventCallback(data);
            return;
        }

        this.emit(event, data, id);
    };

    protected emit(event: keyof FromShopfront, data: any = {}, id: string) {
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
                        return RequestButtons.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_SETTINGS":
                results = results as unknown as Array<Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_SETTINGS"]>) => {
                        return RequestSettings.respond(this.bridge, res.flat(), id);
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
            case "CALLBACK":
                throw new TypeError("Callback event is not valid for external use");
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

    protected handleEventCallback(data: {id?: string, data: any}) {
        if(typeof data.id === "undefined") {
            return;
        }

        let id = data.id;

        ActionEventRegistrar.fire(id, data.data);
    }
}