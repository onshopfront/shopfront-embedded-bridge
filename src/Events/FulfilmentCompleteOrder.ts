import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentCompleteOrder extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_COMPLETED"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_ORDER_COLLECTED"]> {
        return this.callback(data, undefined);
    }
}
