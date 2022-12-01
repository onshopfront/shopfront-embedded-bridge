import { BaseEmitableEvent } from "../BaseEmitableEvent";
import { ToShopfront } from "../../ApplicationEvents";
import { OrderSummaryDetails } from "../../APIs/Fulfilment/FulfilmentTypes";

export class OrderUpdate extends BaseEmitableEvent<{
    order: OrderSummaryDetails;
}> {
    constructor(order: OrderSummaryDetails) {
        super(ToShopfront.FULFILMENT_ORDERS_UPDATE, {
            order,
        });
    }
}
