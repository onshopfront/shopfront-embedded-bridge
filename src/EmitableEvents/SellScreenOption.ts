import {BaseEmitableEvent} from "./BaseEmitableEvent";
import type {SellScreenOption as Option} from "../Events/RequestSellScreenOptions";
import {RequestSellScreenOptions} from "../Events/RequestSellScreenOptions";

export class SellScreenOption extends BaseEmitableEvent<Option> {
    constructor(url: string, title: string) {
        super("SELL_SCREEN_OPTION_CHANGE", {
            id: RequestSellScreenOptions.getOptionId(url),
            url,
            title,
        });
    }
}
