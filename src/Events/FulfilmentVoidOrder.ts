import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentVoidOrder extends BaseEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_VOID_ORDER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_VOID_ORDER"]> {
        return this.callback(data, undefined);
    }
}
