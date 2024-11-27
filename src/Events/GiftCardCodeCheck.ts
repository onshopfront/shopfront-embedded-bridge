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
        console.log("About to start Emit in Bridge" + Date.now());
        const result = await this.callback(data.data, data.context);
        console.log("Finished Emit" + Date.now());

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
        console.log("About to start Response in Bridge" + Date.now());
        bridge.sendMessage(ToShopfront.RESPONSE_GIFT_CARD_CODE_CHECK, data, id);
        console.log("Finished Response" + Date.now());
    }
}
