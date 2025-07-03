import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

export interface SellScreenOption {
    url: string;
    title: string;
    id?: string;
}

export class RequestSellScreenOptions extends BaseEvent<
    undefined,
    MaybePromise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]>,
    FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]
> {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SELL_SCREEN_OPTIONS"]) {
        super(callback);
    }

    /**
     * Generates a unique identifier for a URL by encoding it to base64.
     * If the URL contains non-ASCII characters, it first URI-encodes the URL before converting to base64.
     */
    public static getOptionId(url: string): string {
        try {
            return btoa(url);
        } catch(e) {
            // Contains non-ASCII characters, convert and then encode
            return btoa(encodeURI(url));
        }
    }

    /**
     * Validates the URL by ensuring it follows the HTTPS protocol
     */
    public static validateURL(url: string): void {
        const urlObj = new URL(url);

        if(urlObj.protocol !== "https:") {
            throw new TypeError(`The URL "${url}" is invalid, please ensure that you're using the HTTPS protocol`);
        }
    }

    /**
     * @inheritDoc
     */
    public async emit(_: never): Promise<FromShopfrontReturns["REQUEST_SELL_SCREEN_OPTIONS"]> {
        let result = await this.callback(undefined, undefined);

        if(!Array.isArray(result)) {
            result = [ result ];
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

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(bridge: Bridge, options: Array<SellScreenOption>, id: string): Promise<void> {
        bridge.sendMessage(ToShopfront.RESPONSE_SELL_SCREEN_OPTIONS, options, id);
    }
}
