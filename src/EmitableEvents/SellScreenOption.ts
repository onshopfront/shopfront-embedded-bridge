import {BaseEmitableEvent} from "./BaseEmitableEvent";
import type {SellScreenOption as Option} from "../Events/RequestSellScreenOptions";
import {RequestSellScreenOptions} from "../Events/RequestSellScreenOptions";
import {ToShopfront} from "../ApplicationEvents";

export class SellScreenOption extends BaseEmitableEvent<Option> {
    constructor(url: string, title: string) {
        super(ToShopfront.SELL_SCREEN_OPTION_CHANGE, {
            id: RequestSellScreenOptions.getOptionId(url),
            url,
            title,
        });
    }
}
