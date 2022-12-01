import { BaseEvent } from "./BaseEvent";
import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    FulfilmentApprovalEvent,
} from "../ApplicationEvents";

export class FulfilmentOrderApproval extends BaseEvent<
    FulfilmentApprovalEvent,
    FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"],
    FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_APPROVAL"]) {
        super(callback);
    }

    public async emit(data: FulfilmentApprovalEvent): Promise<FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]> {
        return this.callback(data, undefined);
    }
}
