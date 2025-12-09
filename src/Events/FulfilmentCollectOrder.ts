import type { FromShopfrontCallbacks, FromShopfrontResponse } from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentCollectOrder extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_COLLECTED"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: string): Promise<FromShopfrontResponse["FULFILMENT_ORDER_COLLECTED"]> {
        return this.callback(data, undefined);
    }
}
