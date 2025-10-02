import {
    type FromShopfrontCallbacks,
    type FromShopfrontReturns,
    type GiftCardCodeCheckEvent,
    ToShopfront,
} from "../ApplicationEvents.js";
import { BaseBridge } from "../BaseBridge.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface GiftCardCodeCheckData {
    data: GiftCardCodeCheckEvent;
}

export class GiftCardCodeCheck extends BaseEvent<
    GiftCardCodeCheckData,
    MaybePromise<FromShopfrontReturns["GIFT_CARD_CODE_CHECK"]>,
    FromShopfrontReturns["GIFT_CARD_CODE_CHECK"],
    GiftCardCodeCheckEvent
> {
    constructor(callback: FromShopfrontCallbacks["GIFT_CARD_CODE_CHECK"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(
        data: GiftCardCodeCheckData
    ): Promise<FromShopfrontReturns["GIFT_CARD_CODE_CHECK"]> {
        const result = await this.callback(data.data, undefined);

        if(typeof result !== "object") {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(
        bridge: BaseBridge,
        data: FromShopfrontReturns["GIFT_CARD_CODE_CHECK"],
        id: string
    ): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_GIFT_CARD_CODE_CHECK, data, id);
    }
}
