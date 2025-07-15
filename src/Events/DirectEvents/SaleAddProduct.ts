import { DirectShopfrontCallbacks, DirectShopfrontEventData } from "../../ApplicationEvents.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleAddProduct extends BaseDirectEvent<"SALE_ADD_PRODUCT"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_ADD_PRODUCT"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_ADD_PRODUCT"] {
        if(!event || typeof event !== "object") {
            return false;
        }

        return "product" in event && "indexAddress" in event;
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
