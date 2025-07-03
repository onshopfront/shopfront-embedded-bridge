import { Sale, ShopfrontSaleState } from "../APIs/Sale/index.js";
import { FromShopfrontCallbacks, FromShopfrontReturns, FulfilmentProcessEvent } from "../ApplicationEvents.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface FulfilmentProcessOrderData {
    id: string;
    sale: ShopfrontSaleState;
}

export class FulfilmentProcessOrder extends BaseEvent<
    FulfilmentProcessOrderData,
    MaybePromise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]>,
    MaybePromise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]>,
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
    ): Promise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]> {
        return this.callback({
            id  : data.id,
            sale: new Sale(Sale.buildSaleData(data.sale)),
        }, undefined);
    }
}
