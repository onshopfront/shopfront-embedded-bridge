import { BaseEmitableEvent } from "../BaseEmitableEvent";
import { ToShopfront } from "../../ApplicationEvents";
import { OrderCreateDetails } from "../../APIs/Fulfilment/FulfilmentTypes";

export class OrdersSync extends BaseEmitableEvent<{
    orders: Array<OrderCreateDetails>;
    merge: boolean
}> {
    constructor(orders: Array<OrderCreateDetails>, merge: boolean) {
        super(ToShopfront.FULFILMENT_ORDERS_SYNC, {
            orders,
            merge,
        });
    }
}
