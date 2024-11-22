import { BaseEvent } from "./BaseEvent";
import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    ToShopfront, CheckGiftCardCodeCollisionEvent,
} from "../ApplicationEvents";
import { Bridge } from "../Bridge";
import { MaybePromise } from "../Utilities/MiscTypes";

export class CheckGiftCardCollision extends BaseEvent<
    { data: CheckGiftCardCodeCollisionEvent; },
    MaybePromise<FromShopfrontReturns["CHECK_GIFT_CODE_COLLISION"]>,
    FromShopfrontReturns["CHECK_GIFT_CODE_COLLISION"],
    CheckGiftCardCodeCollisionEvent
> {
    constructor(callback: FromShopfrontCallbacks["CHECK_GIFT_CODE_COLLISION"]) {
        super(callback);
    }

    public async emit(
        data: { data: CheckGiftCardCodeCollisionEvent, context: undefined }
    ): Promise<FromShopfrontReturns["CHECK_GIFT_CODE_COLLISION"]> {
        const result = await this.callback(data.data, data.context);

        if(typeof result !== "object") {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(
        bridge: Bridge,
        data: FromShopfrontReturns["CHECK_GIFT_CODE_COLLISION"],
        id: string
    ) {
        bridge.sendMessage(ToShopfront.RESPONSE_CHECK_GIFT_CODE_COLLISION, data, id);
    }
}
