import { OrderDetails } from "../APIs/Fulfilment/FulfilmentTypes.js";
import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentGetOrder extends BaseEvent<
    string,
    MaybePromise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>,
    MaybePromise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]>
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_GET_ORDER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: string): Promise<FromShopfrontReturns["FULFILMENT_GET_ORDER"]> {
        return this.callback(data, undefined);
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(bridge: Bridge, order: OrderDetails, id: string): Promise<void> {
        bridge.sendMessage(ToShopfront.FULFILMENT_GET_ORDER, order, id);
    }
}
