import { BaseEvent } from "./BaseEvent";
import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents";

export class FulfilmentCollectOrder extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_COLLECTED"]) {
        super(callback);
    }

    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_ORDER_COLLECTED"]> {
        return this.callback(data, undefined);
    }
}
