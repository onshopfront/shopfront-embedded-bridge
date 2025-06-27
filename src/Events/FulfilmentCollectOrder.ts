import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentCollectOrder extends BaseEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_COLLECTED"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_ORDER_COLLECTED"]> {
        return this.callback(data, undefined);
    }
}
