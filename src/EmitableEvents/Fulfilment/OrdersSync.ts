import { type OrderCreateDetails } from "../../APIs/Fulfilment/FulfilmentTypes.js";
import { ToShopfront } from "../../ApplicationEvents.js";
import { BaseEmitableEvent } from "../BaseEmitableEvent.js";

export class OrdersSync extends BaseEmitableEvent<{
    orders: Array<OrderCreateDetails>;
    merge: boolean;
}> {
    constructor(orders: Array<OrderCreateDetails>, merge: boolean) {
        super(ToShopfront.FULFILMENT_ORDERS_SYNC, {
            orders,
            merge,
        });
    }
}
