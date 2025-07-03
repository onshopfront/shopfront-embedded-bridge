import { SaleKey } from "../Actions/SaleKey.js";
import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

export class RequestSaleKeys extends BaseEvent<undefined, MaybePromise<Array<SaleKey>>, Array<SaleKey>> {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SALE_KEYS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(): Promise<FromShopfrontReturns["REQUEST_SALE_KEYS"]> {
        let result = await this.callback(undefined, undefined);

        if(!Array.isArray(result)) {
            result = [ result ];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!(result[i] instanceof SaleKey)) {
                throw new TypeError("You must return an instance of SaleKey");
            }
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(bridge: Bridge, keys: Array<SaleKey>, id: string): Promise<void> {
        const response = [];

        for(let i = 0, l = keys.length; i < l; i++) {
            if(!(keys[i] instanceof SaleKey)) {
                throw new TypeError("Invalid response returned, expected SaleKey");
            }

            response.push(keys[i].serialize());
        }

        bridge.sendMessage(ToShopfront.RESPONSE_SALE_KEYS, response, id);
    }
}
