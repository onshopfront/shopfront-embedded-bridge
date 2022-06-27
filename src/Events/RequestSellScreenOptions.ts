import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {Bridge} from "..";
import {BaseEvent} from "./BaseEvent";
import { MaybePromise } from "../Utilities/MiscTypes";

export interface SellScreenOption {
    url  : string,
    title: string,
    id?  : string,
}

export class RequestSellScreenOptions extends BaseEvent<
    undefined,
    MaybePromise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>,
    FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]
> {
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

    public static validateURL(url: string): void {
        const urlObj = new URL(url);

        if(urlObj.protocol !== "https:") {
            throw new TypeError(`The URL "${url}" is invalid, please ensure that you're using the HTTPS protocol`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async emit(_: never): Promise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]> {
        let result = await this.callback(undefined, undefined);

        if(!Array.isArray(result)) {
            result = [result];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!result[i].url || !result[i].title) {
                throw new TypeError("You must specify both a URL and a title");
            }

            RequestSellScreenOptions.validateURL(result[i].url);

            result[i].id = RequestSellScreenOptions.getOptionId(result[i].url);
        }

        return result;
    }

    public static async respond(bridge: Bridge, options: Array<SellScreenOption>, id: string): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_SELL_SCREEN_OPTIONS, options, id);
    }
}
