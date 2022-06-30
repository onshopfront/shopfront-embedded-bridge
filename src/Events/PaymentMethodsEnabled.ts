import { BaseEvent } from "./BaseEvent";
import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    PaymentMethodEnabledContext,
    SellScreenPaymentMethod,
    ToShopfront,
} from "../ApplicationEvents";
import { Bridge } from "../Bridge";
import { MaybePromise } from "../Utilities/MiscTypes";

export class PaymentMethodsEnabled extends BaseEvent<
    { data: Array<SellScreenPaymentMethod>; context: PaymentMethodEnabledContext },
    MaybePromise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]>,
    FromShopfrontReturns["PAYMENT_METHODS_ENABLED"],
    Array<SellScreenPaymentMethod>,
    PaymentMethodEnabledContext
> {
    constructor(callback: FromShopfrontCallbacks["PAYMENT_METHODS_ENABLED"]) {
        super(callback);
    }

    public async emit(
        data: { data: Array<SellScreenPaymentMethod>; context: PaymentMethodEnabledContext }
    ): Promise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]> {
        const result = await this.callback(data.data, data.context);

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(
        bridge: Bridge,
        data: FromShopfrontReturns["PAYMENT_METHODS_ENABLED"],
        id: string
    ) {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
