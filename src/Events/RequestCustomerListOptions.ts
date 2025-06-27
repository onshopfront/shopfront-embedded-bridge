import { CustomerListOption } from "../Actions/CustomerListOption.js";
import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

export interface SellScreenCustomerListOption {
    contents: string;
    onClick: () => void;
}

export class RequestCustomerListOptions extends BaseEvent<
    Record<string, unknown>,
    MaybePromise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]>,
    FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"],
    undefined
> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["REQUEST_CUSTOMER_LIST_OPTIONS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param _
     */
    public async emit(_: Record<string, unknown>): Promise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]> {
        let result = await this.callback(undefined, undefined);

        if(!Array.isArray(result)) {
            result = [ result ];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!result[i].contents || !result[i].onClick) {
                throw new TypeError("You must specify both the contents and an onClick callback");
            }
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     * @param bridge
     * @param options
     * @param id
     */
    public static async respond(
        bridge: Bridge,
        options: Array<SellScreenCustomerListOption>,
        id: string
    ): Promise<void> {
        bridge.sendMessage(
            ToShopfront.RESPONSE_CUSTOMER_LIST_OPTIONS,
            options.map(option => {
                const o = new CustomerListOption(option.contents);

                o.addEventListener("click", option.onClick);

                return o.serialize();
            }),
            id
        );
    }
}
