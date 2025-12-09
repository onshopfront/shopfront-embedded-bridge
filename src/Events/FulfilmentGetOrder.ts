import { type OrderDetails } from "../APIs/Fulfilment/FulfilmentTypes.js";
import {
    type FromShopfrontCallbacks,
    type FromShopfrontResponse,
    ToShopfront,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseBridge } from "../BaseBridge.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

export class FulfilmentGetOrder extends BaseEvent<
    string,
    MaybePromise<FromShopfrontResponse["FULFILMENT_GET_ORDER"]>,
    MaybePromise<FromShopfrontResponse["FULFILMENT_GET_ORDER"]>
> {
    constructor(callback: FromShopfrontCallbacks["FULFILMENT_GET_ORDER"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: string): Promise<FromShopfrontResponse["FULFILMENT_GET_ORDER"]> {
        return this.callback(data, undefined);
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(bridge: BaseBridge, order: OrderDetails, id: string): Promise<void> {
        bridge.sendMessage(ToShopfront.FULFILMENT_GET_ORDER, order, id);
    }
}
