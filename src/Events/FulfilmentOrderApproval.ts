import {
    type FromShopfrontCallbacks,
    type FromShopfrontReturns,
    type FulfilmentApprovalEvent,
} from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentOrderApproval extends BaseEvent<
    FulfilmentApprovalEvent,
    FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"],
    FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_APPROVAL"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: FulfilmentApprovalEvent): Promise<FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]> {
        return this.callback(data, undefined);
    }
}
