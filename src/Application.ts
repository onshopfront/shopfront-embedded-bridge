import {Bridge} from "./Bridge";
import {
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontInternal,
    FromShopfrontReturns,
    ToShopfront
} from "./ApplicationEvents";
import {Ready} from "./Events/Ready";
import {Serializable} from "./Common/Serializable";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";
import ActionEventRegistrar from "./Utilities/ActionEventRegistrar";
import {RequestTableColumns} from "./Events/RequestTableColumns";

export class Application {
    protected bridge   : Bridge;
    protected isReady  : boolean;
    protected key      : string;
    protected listeners: {
        [key in keyof FromShopfront]: Map<Function, FromShopfront[key]>;
    } = {
        READY                : new Map(),
        REQUEST_SETTINGS     : new Map(),
        REQUEST_BUTTONS      : new Map(),
        REQUEST_TABLE_COLUMNS: new Map(),
        CALLBACK             : new Map(),
    };

    constructor(bridge: Bridge) {
        this.bridge  = bridge;
        this.isReady = false;
        this.key     = '';

        this.bridge.addEventListener(this.handleEvent);
    }

    public destroy() {
        this.bridge.destroy();
    }

    protected handleEvent = (event: keyof FromShopfront | keyof FromShopfrontInternal, data: any, id: string) => {
        if(event === "READY") {
            this.isReady = true;
            this.key     = data.key;
            data         = undefined;
        }

        if(event === "CALLBACK") {
            this.handleEventCallback(data);
            return;
        }

        if(event === "CYCLE_KEY") {
            if(typeof data !== "object" || data === null) {
                return;
            }

            this.key = data.key;
            return;
        }

        this.emit(<keyof FromShopfront>event, data, id);
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
            case "REQUEST_TABLE_COLUMNS":
                results = results as unknown as Array<Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>) => {
                        return RequestTableColumns.respond(this.bridge, res.flat(), id);
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
            case "REQUEST_TABLE_COLUMNS":
                c = new RequestTableColumns(callback as FromShopfrontCallbacks["REQUEST_TABLE_COLUMNS"]);
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

    public download(file: string): void {
        this.bridge.sendMessage(ToShopfront.DOWNLOAD, file);
    }

    public load(): () => void {
        this.bridge.sendMessage(ToShopfront.LOAD, true);

        return () => this.bridge.sendMessage(ToShopfront.LOAD, false);
    }

    protected handleEventCallback(data: {id?: string, data: any}) {
        if(typeof data.id === "undefined") {
            return;
        }

        let id = data.id;

        ActionEventRegistrar.fire(id, data.data);
    }

    public getAuthenticationKey(): string {
        return this.key;
    }
}
