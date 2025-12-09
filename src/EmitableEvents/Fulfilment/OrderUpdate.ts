import { type OrderSummaryDetails } from "../../APIs/Fulfilment/FulfilmentTypes.js";
import { ToShopfront } from "../../ApplicationEvents/ToShopfront.js";
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
