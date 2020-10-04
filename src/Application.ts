import {Bridge} from "./Bridge";
import {
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontInternal,
    FromShopfrontReturns, RegisterChangedEvent,
    ToShopfront
} from "./ApplicationEvents";
import {Ready} from "./Events/Ready";
import {Serializable} from "./Common/Serializable";
import {Button} from "./Actions/Button";
import {RequestSettings} from "./Events/RequestSettings";
import {RequestButtons} from "./Events/RequestButtons";
import ActionEventRegistrar from "./Utilities/ActionEventRegistrar";
import {RequestTableColumns} from "./Events/RequestTableColumns";
import {RequestSellScreenOptions} from "./Events/RequestSellScreenOptions";
import {BaseEmitableEvent} from "./EmitableEvents/BaseEmitableEvent";
import {Sale} from "./APIs/CurrentSale";
import {ShopfrontSaleState} from "./APIs/CurrentSale/ShopfrontSaleState";
import {InternalPageMessage} from "./Events/InternalPageMessage";
import {RegisterChanged} from "./Events/RegisterChanged";
import {Database} from "./APIs/Database/Database";

export class Application {
    protected bridge   : Bridge;
    protected isReady  : boolean;
    protected key      : string;
    protected register : string | null;
    protected outlet   : string | null;
    protected user     : string | null;
    protected listeners: {
        [key in keyof Omit<FromShopfront, "CALLBACK">]: Map<Function, FromShopfront[key]>;
    } = {
        READY                      : new Map(),
        REQUEST_SETTINGS           : new Map(),
        REQUEST_BUTTONS            : new Map(),
        REQUEST_TABLE_COLUMNS      : new Map(),
        REQUEST_SELL_SCREEN_OPTIONS: new Map(),
        INTERNAL_PAGE_MESSAGE      : new Map(),
        REGISTER_CHANGED           : new Map(),
    };
    public database: Database;

    constructor(bridge: Bridge) {
        this.bridge   = bridge;
        this.isReady  = false;
        this.key      = '';
        this.register = null;
        this.outlet   = null;
        this.user     = null;
        this.database = new Database(this.bridge);

        this.bridge.addEventListener(this.handleEvent);
        this.addEventListener("REGISTER_CHANGED", this.handleLocationChanged);
    }

    public destroy() {
        this.bridge.destroy();
    }

    protected handleEvent = (event: keyof FromShopfront | keyof FromShopfrontInternal, data: any, id: string) => {
        if(event === "READY") {
            this.isReady = true;
            this.key     = data.key;
            data = {
                outlet  : data.outlet,
                register: data.register,
            };
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
        } else if(event === "LOCATION_CHANGED") {
            // Unregister all serialized listeners as they're no longer displayed
            ActionEventRegistrar.clear();
            return;
        } else if(event === "RESPONSE_CURRENT_SALE" || event === "RESPONSE_DATABASE_REQUEST") {
            // Handled elsewhere
            return;
        }

        this.emit(event, data, id);
    };

    protected emit(event: keyof Omit<FromShopfront, "CALLBACK">, data: any = {}, id: string) {
        let results = [];

        if(typeof this.listeners[event] === "undefined") {
            return this.bridge.sendMessage(ToShopfront.UNSUPPORTED_EVENT, event, id);
        }

        for(let e of this.listeners[event].values()) {
            results.push(e.emit(data) as Promise<FromShopfrontReturns[typeof event]>);
        }

        // Respond if necessary
        switch(event) {
            case "REQUEST_BUTTONS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_BUTTONS"]>>;

                return Promise.all(results)
                    .then((res: Array<Array<Button>>) => {
                        return RequestButtons.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_SETTINGS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_SETTINGS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_SETTINGS"]>) => {
                        return RequestSettings.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_TABLE_COLUMNS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>) => {
                        return RequestTableColumns.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_SELL_SCREEN_OPTIONS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>) => {
                        return RequestSellScreenOptions.respond(this.bridge, res.flat(), id);
                    });
        }
    }

    public addEventListener(event: keyof Omit<FromShopfront, "CALLBACK">, callback: Function) {
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
            case "REQUEST_SELL_SCREEN_OPTIONS":
                c = new RequestSellScreenOptions(callback as FromShopfrontCallbacks["REQUEST_SELL_SCREEN_OPTIONS"]);
                this.listeners[event].set(callback, c);
                break;
            case "INTERNAL_PAGE_MESSAGE":
                c = new InternalPageMessage(callback as FromShopfrontCallbacks["INTERNAL_PAGE_MESSAGE"], this);
                this.listeners[event].set(callback, c);
                break;
            case "REGISTER_CHANGED":
                c = new RegisterChanged(callback as FromShopfrontCallbacks["REGISTER_CHANGED"]);
                this.listeners[event].set(callback, c);
                break;
        }

        if(c === null) {
            throw new TypeError(`${event} has not been defined`);
        }

        if(event === "READY" && this.isReady) {
            c = c as Ready;
            c.emit({
                outlet: this.outlet,
                register: this.register,
                user: this.user,
            });
        }
    }

    public removeEventListener(event: keyof Omit<FromShopfront, "CALLBACK">, callback: () => void) {
        this.listeners[event].delete(callback);
    }

    public send(item: BaseEmitableEvent<any>): void;
    public send(item: Serializable<any>): void;
    public send(item: any): void {
        if(item instanceof Button) {
            throw new TypeError("You cannot send Buttons to Shopfront without Shopfront requesting them");
        }

        if(item instanceof BaseEmitableEvent) {
            this.bridge.sendMessage(item.getEvent(), item.getData());
        } else {
            const serialized = item.serialize();

            this.bridge.sendMessage(ToShopfront.SERIALIZED, serialized);
        }
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

    protected handleLocationChanged(data: RegisterChangedEvent) {
        this.register = data.register;
        this.outlet = data.outlet;
        this.user = data.user;
    }

    public getAuthenticationKey(): string {
        return this.key;
    }

    /**
     * Get the current sale on the sell screen, if the current device is not a register
     * then this will return false.
     *
     * @returns {Promise<Sale | boolean>}
     */
    public async getCurrentSale(): Promise<Sale | false> {
        const saleRequest = `SaleRequest-${Date.now().toString()}`;

        const promise: Promise<ShopfrontSaleState | false> = new Promise(res => {
            const listener = (event: keyof FromShopfrontInternal | keyof FromShopfront, data: any) => {
                if(event !== "RESPONSE_CURRENT_SALE") {
                    return;
                }

                data = data as {
                    requestId: string,
                    saleState: ShopfrontSaleState | false,
                };

                if(data.requestId !== saleRequest) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res(data.saleState);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.REQUEST_CURRENT_SALE, {
            requestId: saleRequest,
        });

        const saleState = await promise;

        if(saleState === false) {
            return saleState;
        }

        return new Sale(this, saleState);
    }
}
