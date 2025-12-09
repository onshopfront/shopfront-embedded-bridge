import type {
    DirectShopfrontCallbacks,
    DirectShopfrontEventData,
} from "../../ApplicationEvents/DirectShopfront.js";
import { BaseDirectEvent } from "./BaseDirectEvent.js";

export class SaleClear extends BaseDirectEvent<"SALE_CLEAR"> {
    constructor(callback: DirectShopfrontCallbacks["SALE_CLEAR"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    protected isEventData(event: unknown): event is DirectShopfrontEventData["SALE_CLEAR"] {
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
