import { BaseEvent } from "./BaseEvent";
import { FromShopfrontCallbacks, FromShopfrontReturns, FulfilmentProcessEvent } from "../ApplicationEvents";
import { Sale, ShopfrontSaleState } from "../APIs/Sale";
import { MaybePromise } from "../Utilities/MiscTypes";

export class FulfilmentProcessOrder extends BaseEvent<
    { id: string; sale: ShopfrontSaleState },
    MaybePromise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]>,
    MaybePromise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]>,
    FulfilmentProcessEvent
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_PROCESS_ORDER"]) {
        super(callback);
    }

    public async emit(data: { id: string; sale: ShopfrontSaleState }): Promise<FromShopfrontReturns["FULFILMENT_PROCESS_ORDER"]> {
        return this.callback({
            id: data.id,
            sale: new Sale(Sale.buildSaleData(data.sale)),
        }, undefined);
    }
}
