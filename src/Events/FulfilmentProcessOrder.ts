import { Sale, type ShopfrontSaleState } from "../APIs/Sale/index.js";
import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
    FulfilmentProcessEvent,
} from "../ApplicationEvents/ToShopfront.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface FulfilmentProcessOrderData {
    id: string;
    sale: ShopfrontSaleState;
}

export class FulfilmentProcessOrder extends BaseEvent<
    FulfilmentProcessOrderData,
    MaybePromise<FromShopfrontResponse["FULFILMENT_PROCESS_ORDER"]>,
    MaybePromise<FromShopfrontResponse["FULFILMENT_PROCESS_ORDER"]>,
    FulfilmentProcessEvent
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_PROCESS_ORDER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(
        data: FulfilmentProcessOrderData
    ): Promise<FromShopfrontResponse["FULFILMENT_PROCESS_ORDER"]> {
        return this.callback({
            id  : data.id,
            sale: new Sale(Sale.buildSaleData(data.sale)),
        }, undefined);
    }
}
