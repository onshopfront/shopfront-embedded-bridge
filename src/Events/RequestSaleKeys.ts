import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {Bridge} from "..";
import {BaseEvent} from "./BaseEvent";
import { SaleKey } from "../Actions/SaleKey";

export class RequestSaleKeys extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SALE_KEYS"]) {
        super(callback);
    }

    public async emit(): Promise<FromShopfrontReturns["REQUEST_SALE_KEYS"]> {
        let result = await Promise.resolve(this.callback());

        if(!Array.isArray(result)) {
            result = [result];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!(result[i] instanceof SaleKey)) {
                throw new TypeError("You must return an instance of SaleKey");
            }
        }

        return result;
    }

    public static async respond(bridge: Bridge, keys: Array<SaleKey>, id: string): Promise<void> {
        let response = [];
        for(let i = 0, l = keys.length; i < l; i++) {
            if(!(keys[i] instanceof SaleKey)) {
                throw new TypeError("Invalid response returned, expected SaleKey");
            }

            response.push(keys[i].serialize());
        }

        bridge.sendMessage(ToShopfront.RESPONSE_SALE_KEYS, response, id);
    }
}
