import { DirectShopfrontCallbacks, DirectShopfrontEventData } from "../../ApplicationEvents.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleAddCustomer extends BaseDirectEvent<"SALE_ADD_CUSTOMER"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_ADD_CUSTOMER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_ADD_CUSTOMER"] {
        if(!event || typeof event !== "object") {
            return false;
        }

        return "customer" in event;
    }

    /**
     * @inheritDoc
     */
    public async emit(event: unknown): Promise<void> {
        if(!this.isEventData(event)) {
            return;
        }

        return this.callback(event);
    }
}
