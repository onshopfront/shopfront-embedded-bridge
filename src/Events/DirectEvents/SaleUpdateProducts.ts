import { type DirectShopfrontCallbacks, type DirectShopfrontEventData } from "../../ApplicationEvents.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleUpdateProducts extends BaseDirectEvent<"SALE_UPDATE_PRODUCTS"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_UPDATE_PRODUCTS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_UPDATE_PRODUCTS"] {
        if(!event || typeof event !== "object") {
            return false;
        }

        return "products" in event;
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
