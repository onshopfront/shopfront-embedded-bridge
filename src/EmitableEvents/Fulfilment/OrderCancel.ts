import { BaseEmitableEvent } from "../BaseEmitableEvent";
import { ToShopfront } from "../../ApplicationEvents";

export class OrderCancel extends BaseEmitableEvent<{
    id: string;
}> {
    constructor(id: string) {
        super(ToShopfront.FULFILMENT_ORDERS_CANCEL, {
            id,
        });
    }
}
