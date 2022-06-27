import {Bridge} from "./Bridge";
import {
    DirectShopfrontEvent,
    directShopfrontEvents,
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontInternal,
    FromShopfrontReturns,
    RegisterChangedEvent,
    ToShopfront
} from "./ApplicationEvents";
import { Ready } from "./Events/Ready";
import { Serializable } from "./Common/Serializable";
import { Button } from "./Actions/Button";
import { RequestSettings } from "./Events/RequestSettings";
import { RequestButtons } from "./Events/RequestButtons";
import ActionEventRegistrar from "./Utilities/ActionEventRegistrar";
import { RequestTableColumns } from "./Events/RequestTableColumns";
import { RequestSellScreenOptions } from "./Events/RequestSellScreenOptions";
import { BaseEmitableEvent } from "./EmitableEvents/BaseEmitableEvent";
import { Sale } from "./APIs/CurrentSale";
import { ShopfrontSaleState } from "./APIs/CurrentSale/ShopfrontSaleState";
import { InternalPageMessage } from "./Events/InternalPageMessage";
import { RegisterChanged } from "./Events/RegisterChanged";
import { Database } from "./APIs/Database/Database";
import { FormatIntegratedProduct } from "./Events/FormatIntegratedProduct";
import { MaybePromise } from "./Utilities/MiscTypes";
import { RequestCustomerListOptions } from "./Events/RequestCustomerListOptions";
import { RequestSaleKeys } from "./Events/RequestSaleKeys";
import { SaleComplete } from "./Events/SaleComplete";
import { BaseEvent } from "./Events/BaseEvent";

// noinspection JSUnusedGlobalSymbols
export class Application {
    protected bridge   : Bridge;
    protected isReady  : boolean;
    protected key      : string;
    protected register : string | null;
    protected outlet   : string | null;
    protected user     : string | null;
    protected listeners: {
        [key in keyof Omit<FromShopfront, "CALLBACK">]: Map<
            (...args: Array<unknown>) => void,
            FromShopfront[key] & BaseEvent
        >;
    } = {
        READY                        : new Map(),
        REQUEST_SETTINGS             : new Map(),
        REQUEST_BUTTONS              : new Map(),
        REQUEST_TABLE_COLUMNS        : new Map(),
        REQUEST_SELL_SCREEN_OPTIONS  : new Map(),
        INTERNAL_PAGE_MESSAGE        : new Map(),
        REGISTER_CHANGED             : new Map(),
        FORMAT_INTEGRATED_PRODUCT    : new Map(),
        REQUEST_CUSTOMER_LIST_OPTIONS: new Map(),
        REQUEST_SALE_KEYS            : new Map(),
        SALE_COMPLETE                : new Map(),
    };
    protected directListeners: {
        [K in DirectShopfrontEvent]?: Set<(data: unknown) => void | Promise<void>>;
    } = {};
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

    protected handleEvent = (
        event: keyof FromShopfront | keyof FromShopfrontInternal,
        data: Record<string, unknown>,
        id: string
    ) => {
        if(event === "READY") {
            this.isReady = true;
            this.key     = data.key as string;
            data = {
                outlet  : data.outlet,
                register: data.register,
            };
        }

        if(event === "CALLBACK") {
            this.handleEventCallback(data as { id?: string; data: unknown });
            return;
        }

        if(event === "CYCLE_KEY") {
            if(typeof data !== "object" || data === null) {
                return;
            }

            this.key = data.key as string;
            return;
        } else if(event === "LOCATION_CHANGED") {
            // Unregister all serialized listeners as they're no longer displayed
            ActionEventRegistrar.clear();
            return;
        } else if(
            event === "RESPONSE_CURRENT_SALE" ||
            event === "RESPONSE_DATABASE_REQUEST" ||
            event === "RESPONSE_LOCATION" ||
            event === "RESPONSE_OPTION"
        ) {
            // Handled elsewhere
            return;
        }

        this.emit(event, data, id);
    };

    protected emit(
        event: keyof Omit<FromShopfront, "CALLBACK"> | DirectShopfrontEvent,
        data: Record<string, unknown> = {},
        id: string
    ) {
        if(directShopfrontEvents.includes(event as unknown as DirectShopfrontEvent)) {
            event = (event as DirectShopfrontEvent);

            const listeners = this.directListeners[event];
            if(typeof listeners === "undefined") {
                return this.bridge.sendMessage(ToShopfront.NOT_LISTENING_TO_EVENT);
            }

            const results = [];
            for(const e of listeners.values()) {
                results.push(e(data));
            }

            return Promise.all(results)
                .then(() => {
                    // Ensure void is returned
                });
        }

        event = (event as keyof Omit<FromShopfront, "CALLBACK">);

        let results = [];

        if(typeof this.listeners[event] === "undefined") {
            return this.bridge.sendMessage(ToShopfront.UNSUPPORTED_EVENT, event, id);
        }

        if(this.listeners[event].size === 0) {
            return this.bridge.sendMessage(ToShopfront.NOT_LISTENING_TO_EVENT, event, id);
        }

        for(const e of this.listeners[event].values()) {
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
            case "FORMAT_INTEGRATED_PRODUCT":
                results = results as Array<Promise<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>>;

                return Promise.all(results)
                    .then((res: Array<FromShopfrontReturns["FORMAT_INTEGRATED_PRODUCT"]>) => {
                        return FormatIntegratedProduct.respond(this.bridge, res.flat(), id);
                    });
            case "REQUEST_CUSTOMER_LIST_OPTIONS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]>>;

                return Promise.all(results)
                    .then(res => RequestCustomerListOptions.respond(this.bridge, res.flat(), id));
            case "REQUEST_SALE_KEYS":
                results = results as Array<Promise<FromShopfrontReturns["REQUEST_SALE_KEYS"]>>;

                return Promise.all(results)
                    .then(res => RequestSaleKeys.respond(this.bridge, res.flat(), id));
        }
    }

    public addEventListener<E extends keyof FromShopfrontCallbacks>(
        event: E,
        callback: FromShopfrontCallbacks[E]
    ): void;
    public addEventListener<D>(
        event: DirectShopfrontEvent,
        callback: (event: D) => MaybePromise<void>
    ): void;
    public addEventListener(
        event: keyof Omit<FromShopfront, "CALLBACK"> | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => void
    ) {
        if(directShopfrontEvents.includes(event as DirectShopfrontEvent)) {
            event = (event as DirectShopfrontEvent);

            if(typeof this.directListeners[event] === "undefined") {
                this.directListeners[event] = new Set();
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.directListeners[event]!.add(callback as () => void);

            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let c: BaseEvent<any, any, any, any, any> | undefined;

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
                this.listeners[event].set(callback, c as InternalPageMessage);
                break;
            case "REGISTER_CHANGED":
                c = new RegisterChanged(callback as FromShopfrontCallbacks["REGISTER_CHANGED"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_CUSTOMER_LIST_OPTIONS":
                c = new RequestCustomerListOptions(callback as FromShopfrontCallbacks["REQUEST_CUSTOMER_LIST_OPTIONS"]);
                this.listeners[event].set(callback, c);
                break;
            case "FORMAT_INTEGRATED_PRODUCT":
                c = new FormatIntegratedProduct(callback as FromShopfrontCallbacks["FORMAT_INTEGRATED_PRODUCT"]);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_SALE_KEYS":
                c = new RequestSaleKeys(callback as FromShopfrontCallbacks["REQUEST_SALE_KEYS"]);
                this.listeners[event].set(callback, c as RequestSaleKeys);
                break;
            case "SALE_COMPLETE":
                c = new SaleComplete(callback as FromShopfrontCallbacks["SALE_COMPLETE"]);
                this.listeners[event].set(callback, c);
                break;
        }

        if(typeof c === "undefined") {
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

    public removeEventListener(
        event: keyof Omit<FromShopfront, "CALLBACK"> | DirectShopfrontEvent,
        callback: (...args: Array<unknown>) => MaybePromise<void>
    ) {
        if(directShopfrontEvents.includes(event as DirectShopfrontEvent)) {
            this.directListeners[event as DirectShopfrontEvent]?.delete(callback);
            return;
        }

        this.listeners[event as keyof Omit<FromShopfront, "CALLBACK">].delete(callback);
    }

    public send(item: BaseEmitableEvent<unknown>): void;
    public send(item: Serializable<unknown>): void;
    public send(item: BaseEmitableEvent<unknown> | Serializable<unknown>): void {
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

    public redirect(toLocation: string, externalRedirect = true): void {
        this.bridge.sendMessage(ToShopfront.REDIRECT, {
            to: toLocation,
            external: externalRedirect,
        });
    }

    public load(): () => void {
        this.bridge.sendMessage(ToShopfront.LOAD, true);

        return () => this.bridge.sendMessage(ToShopfront.LOAD, false);
    }

    protected handleEventCallback(data: { id?: string, data: unknown }) {
        if(typeof data.id === "undefined") {
            return;
        }

        const id = data.id;

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

    protected dataIsSaleEvent(data: Record<string, unknown>): data is { requestId: string; saleState: ShopfrontSaleState | false } {
        return data.requestId === "string" && (data.saleState === false || typeof data.saleState === "object");
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
            const listener = (event: keyof FromShopfrontInternal | keyof FromShopfront, data: Record<string, unknown>) => {
                if(event !== "RESPONSE_CURRENT_SALE") {
                    return;
                }

                if(!this.dataIsSaleEvent(data)) {
                    return;
                }

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

    protected dataIsLocation(data: Record<string, unknown>): data is {
        requestId: string;
        register: string | null;
        outlet: string | null;
        user: string | null;
    } {
        return typeof data.requestId === "string" &&
            (typeof data.register === "string" || data.register === null) &&
            (typeof data.outlet === "string" || data.outlet === null) &&
            (typeof data.user === "string" || data.user === null);
    }

    /**
     * Get the location from Shopfront
     */
    public async getLocation(): Promise<{
        register: string | null;
        outlet: string | null;
        user: string | null;
    }> {
        const locationRequest = `LocationRequest-${Date.now().toString()}`;

        const promise = new Promise<{
            register: string | null;
            outlet  : string | null;
            user    : string | null;
        }>(res => {
            const listener = (event: keyof FromShopfrontInternal | keyof FromShopfront, data: Record<string, unknown>) => {
                if(event !== "RESPONSE_LOCATION") {
                    return;
                }

                if(!this.dataIsLocation(data)) {
                    return;
                }

                if(data.requestId !== locationRequest) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res(data);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.REQUEST_LOCATION, {
            requestId: locationRequest,
        });

        const location = await promise;

        return {
            register: location.register,
            outlet  : location.outlet,
            user    : location.user,
        };
    }

    public printReceipt(content: string): void {
        this.bridge.sendMessage(ToShopfront.PRINT_RECEIPT, {
            content,
            type: "text",
        });
    }

    protected dataIsOption<TValueType>(data: Record<string, unknown>): data is {
        requestId: string;
        option: string;
        value: TValueType | undefined;
    } {
        return typeof data.requestId === "string" && typeof data.option === "string";
    }

    public async getOption<TValueType>(option: string, defaultValue: TValueType): Promise<TValueType> {
        const request = `OptionRequest-${Date.now().toString()}`;

        const promise = new Promise<TValueType | undefined>(res => {
            const listener = (event: keyof FromShopfrontInternal | keyof FromShopfront, data: Record<string, unknown>) => {
                if(event !== "RESPONSE_OPTION") {
                    return;
                }

                if(!this.dataIsOption<TValueType>(data)) {
                    return;
                }

                if(data.requestId !== request) {
                    return;
                }

                this.bridge.removeEventListener(listener);
                res(data.value);
            };

            this.bridge.addEventListener(listener);
        });

        this.bridge.sendMessage(ToShopfront.GET_OPTION, {
            requestId: request,
            option,
        });

        const optionValue = await promise;
        if(typeof optionValue === "undefined") {
            return defaultValue;
        }

        return optionValue;
    }
}
