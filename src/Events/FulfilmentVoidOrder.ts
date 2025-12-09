import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentVoidOrder extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_VOID_ORDER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: string): Promise<FromShopfrontResponse["FULFILMENT_VOID_ORDER"]> {
        return this.callback(data, undefined);
    }
}
