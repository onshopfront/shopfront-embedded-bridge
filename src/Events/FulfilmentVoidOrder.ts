import { BaseEvent } from "./BaseEvent";
import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents";

export class FulfilmentVoidOrder extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_VOID_ORDER"]) {
        super(callback);
    }

    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_VOID_ORDER"]> {
        return this.callback(data, undefined);
    }
}
