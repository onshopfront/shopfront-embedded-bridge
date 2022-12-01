import { BaseEvent } from "./BaseEvent";
import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents";

export class FulfilmentCompleteOrder extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_COMPLETED"]) {
        super(callback);
    }

    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_ORDER_COLLECTED"]> {
        return this.callback(data, undefined);
    }
}
