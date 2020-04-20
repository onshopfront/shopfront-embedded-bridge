import {ToShopfront} from "../ApplicationEvents";

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

    public getEvent(): ToShopfront {
        return this.eventName;
    }

    public getData(): T {
        return this.eventData;
    }
}
