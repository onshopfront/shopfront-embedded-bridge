import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {Bridge} from "..";
import {BaseEvent} from "./BaseEvent";

export interface SellScreenOption {
    url  : string,
    title: string,
    id?  : string,
}

export class RequestSellScreenOptions extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SELL_SCREEN_OPTIONS"]) {
        super(callback);
    }

    public static getOptionId(url: string) {
        try {
            return btoa(url);
        } catch(e) {
            // Contains non-ASCII characters, convert and then encode
            return btoa(encodeURI(url));
        }
    }

    public async emit(data: {}): Promise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]> {
        let result = await Promise.resolve(this.callback());

        if(!Array.isArray(result)) {
            result = [result];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!result[i].url || !result[i].title) {
                throw new TypeError("You must specify both a URL and a title");
            }

            result[i].id = RequestSellScreenOptions.getOptionId(result[i].url);
        }

        return result;
    }

    public static async respond(bridge: Bridge, options: Array<SellScreenOption>, id: string): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_SELL_SCREEN_OPTIONS, options, id);
    }
}
