import { BaseEvent } from "./BaseEvent";
import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    ToShopfront, GiftCardCodeCheckEvent,
} from "../ApplicationEvents";
import { Bridge } from "../Bridge";
import { MaybePromise } from "../Utilities/MiscTypes";

export class GiftCardCodeCheck extends BaseEvent<
    { data: GiftCardCodeCheckEvent; },
    MaybePromise<FromShopfrontReturns["GIFT_CARD_CODE_CHECK"]>,
    FromShopfrontReturns["GIFT_CARD_CODE_CHECK"],
    GiftCardCodeCheckEvent
> {
    constructor(callback: FromShopfrontCallbacks["GIFT_CARD_CODE_CHECK"]) {
        super(callback);
    }

    public async emit(
        data: { data: GiftCardCodeCheckEvent, context: undefined }
    ): Promise<FromShopfrontReturns["GIFT_CARD_CODE_CHECK"]> {
        const result = await this.callback(data.data, data.context);

        if(typeof result !== "object") {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(
        bridge: Bridge,
        data: FromShopfrontReturns["GIFT_CARD_CODE_CHECK"],
        id: string
    ) {
        bridge.sendMessage(ToShopfront.RESPONSE_GIFT_CARD_CODE_CHECK, data, id);
    }
}
