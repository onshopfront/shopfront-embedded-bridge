import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
    FulfilmentApprovalEvent,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentOrderApproval extends BaseEvent<
    FulfilmentApprovalEvent,
    FromShopfrontResponse["FULFILMENT_ORDER_APPROVAL"],
    FromShopfrontResponse["FULFILMENT_ORDER_APPROVAL"]
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_ORDER_APPROVAL"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: FulfilmentApprovalEvent): Promise<FromShopfrontResponse["FULFILMENT_ORDER_APPROVAL"]> {
        return this.callback(data, undefined);
    }
}
