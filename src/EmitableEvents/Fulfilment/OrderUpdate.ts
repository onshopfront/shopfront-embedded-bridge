import { OrderSummaryDetails } from "../../APIs/Fulfilment/FulfilmentTypes.js";
import { ToShopfront } from "../../ApplicationEvents.js";
import { BaseEmitableEvent } from "../BaseEmitableEvent.js";

export class OrderUpdate extends BaseEmitableEvent<{
    order: OrderSummaryDetails;
}> {
    constructor(order: OrderSummaryDetails) {
        super(ToShopfront.FULFILMENT_ORDERS_UPDATE, {
            order,
        });
    }
}
