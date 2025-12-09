import { type OrderCreateDetails } from "../../APIs/Fulfilment/FulfilmentTypes.js";
import { ToShopfront } from "../../ApplicationEvents/ToShopfront.js";
import { BaseEmitableEvent } from "../BaseEmitableEvent.js";

export class OrderCreate extends BaseEmitableEvent<{
    order: OrderCreateDetails;
}> {
    constructor(order: OrderCreateDetails) {
        super(ToShopfront.FULFILMENT_ORDERS_CREATE, {
            order,
        });
    }
}
