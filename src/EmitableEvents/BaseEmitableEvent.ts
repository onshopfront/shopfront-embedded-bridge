import { ToShopfront } from "../ApplicationEvents/ToShopfront.js";

export class BaseEmitableEvent<T> {
    protected eventName: ToShopfront;
    protected eventData: T;

    constructor(shopfrontEventName: ToShopfront, data: T) {
        if(new.target === BaseEmitableEvent) {
            throw new TypeError("You cannot construct BaseEmitableEvent instances directly");
        }

        this.eventName = shopfrontEventName;
        this.eventData = data;
    }

    /**
     * Returns the event name
     */
    public getEvent(): ToShopfront {
        return this.eventName;
    }

    /**
     * Returns the event data
     */
    public getData(): T {
        return this.eventData;
    }
}
