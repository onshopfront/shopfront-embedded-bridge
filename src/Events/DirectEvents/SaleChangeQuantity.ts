import type {
    DirectShopfrontCallbacks,
    DirectShopfrontEventData,
} from "../../ApplicationEvents/DirectShopfront.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleChangeQuantity extends BaseDirectEvent<"SALE_CHANGE_QUANTITY"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_CHANGE_QUANTITY"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_CHANGE_QUANTITY"] {
        if(!event || typeof event !== "object") {
            return false;
        }

        return "indexAddress" in event && "amount" in event && "absolute" in event;
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
