import { ToShopfront } from "../../ApplicationEvents.js";
import { BaseEmitableEvent } from "../BaseEmitableEvent.js";

export class OrderCancel extends BaseEmitableEvent<{
    id: string;
}> {
    constructor(id: string) {
        super(ToShopfront.FULFILMENT_ORDERS_CANCEL, {
            id,
        });
    }
}
