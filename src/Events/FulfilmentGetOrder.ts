import { BaseEvent } from "./BaseEvent";
import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents";
import { MaybePromise } from "../Utilities/MiscTypes";
import { Bridge } from "../Bridge";
import { OrderDetails } from "../APIs/Fulfilment/FulfilmentTypes";

export class FulfilmentGetOrder extends BaseEvent<
    string,
    MaybePromise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>,
    MaybePromise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_GET_ORDER"]) {
        super(callback);
    }

    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]> {
        return this.callback(data, undefined);
    }

    public static async respond(bridge: Bridge, order: OrderDetails, id: string): Promise<void> {
        bridge.sendMessage(ToShopfront.FULFILMENT_GET_ORDER, order, id);
    }
}
