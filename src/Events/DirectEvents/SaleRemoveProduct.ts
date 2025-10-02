import { type DirectShopfrontCallbacks, type DirectShopfrontEventData } from "../../ApplicationEvents.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleRemoveProduct extends BaseDirectEvent<"SALE_REMOVE_PRODUCT"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_REMOVE_PRODUCT"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_REMOVE_PRODUCT"] {
        if(!event || typeof event !== "object") {
            return false;
        }

        return "indexAddress" in event;
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
