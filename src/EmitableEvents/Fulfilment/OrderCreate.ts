import { BaseEmitableEvent } from "../BaseEmitableEvent";
import { ToShopfront } from "../../ApplicationEvents";
import { OrderCreateDetails } from "../../APIs/Fulfilment/FulfilmentTypes";

export class OrderCreate extends BaseEmitableEvent<{
    order: OrderCreateDetails;
}> {
    constructor(order: OrderCreateDetails) {
        super(ToShopfront.FULFILMENT_ORDERS_CREATE, {
            order,
        });
    }
}
