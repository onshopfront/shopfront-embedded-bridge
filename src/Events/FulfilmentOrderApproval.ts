import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    FulfilmentApprovalEvent,
} from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentOrderApproval extends BaseEvent<
    FulfilmentApprovalEvent,
    FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"],
    FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]
> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_APPROVAL"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: FulfilmentApprovalEvent): Promise<FromShopfrontReturns["FULFILMENT_ORDER_APPROVAL"]> {
        return this.callback(data, undefined);
    }
}
