export class BaseEmitableEvent<T> {
    protected eventName: string;
    protected eventData: T;

    constructor(shopfrontEventName: string, data: T) {
        if(new.target === BaseEmitableEvent) {
            throw new TypeError("You cannot construct BaseEmitableEvent instances directly");
        }

        this.eventName = shopfrontEventName;
        this.eventData = data;
    }
}
