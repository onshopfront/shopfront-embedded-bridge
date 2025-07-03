import { ToShopfront } from "../ApplicationEvents.js";
import type { SellScreenOption as Option } from "../Events/RequestSellScreenOptions.js";
import { RequestSellScreenOptions } from "../Events/RequestSellScreenOptions.js";
import { BaseEmitableEvent } from "./BaseEmitableEvent.js";

export class SellScreenOption extends BaseEmitableEvent<Option> {
    constructor(url: string, title: string) {
        RequestSellScreenOptions.validateURL(url);

        super(ToShopfront.SELL_SCREEN_OPTION_CHANGE, {
            id: RequestSellScreenOptions.getOptionId(url),
            url,
            title,
        });
    }
}
