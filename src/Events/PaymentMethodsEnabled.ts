import {
    FromShopfrontCallbacks,
    FromShopfrontReturns,
    PaymentMethodEnabledContext,
    SellScreenPaymentMethod,
    ToShopfront,
} from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface PaymentMethodsEnabledData {
    data: Array<SellScreenPaymentMethod>;
    context: PaymentMethodEnabledContext;
}

export class PaymentMethodsEnabled extends BaseEvent<
    PaymentMethodsEnabledData,
    MaybePromise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]>,
    FromShopfrontReturns["PAYMENT_METHODS_ENABLED"],
    Array<SellScreenPaymentMethod>,
    PaymentMethodEnabledContext
> {
    constructor(callback: FromShopfrontCallbacks["PAYMENT_METHODS_ENABLED"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: PaymentMethodsEnabledData): Promise<FromShopfrontReturns["PAYMENT_METHODS_ENABLED"]> {
        const result = await this.callback(data.data, data.context);

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(
        bridge: Bridge,
        data: FromShopfrontReturns["PAYMENT_METHODS_ENABLED"],
        id: string
    ): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_UI_PIPELINE, data, id);
    }
}
