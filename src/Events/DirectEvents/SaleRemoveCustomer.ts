import type {
    DirectShopfrontCallbacks,
    DirectShopfrontEventData,
} from "../../ApplicationEvents/DirectShopfront.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleRemoveCustomer extends BaseDirectEvent<"SALE_REMOVE_CUSTOMER"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_REMOVE_CUSTOMER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_REMOVE_CUSTOMER"] {
        return true;
    }

    /**
     * @inheritDoc
     */
    public async emit(event: unknown): Promise<void> {
        if(!this.isEventData(event)) {
            return;
        }

        return this.callback();
    }
}
