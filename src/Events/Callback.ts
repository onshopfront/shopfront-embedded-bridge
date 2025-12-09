import type { FromShopfrontCallbacks, FromShopfrontResponse } from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class Callback extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["CALLBACK"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(): Promise<FromShopfrontResponse["CALLBACK"]> {
        return this.callback(undefined, undefined);
    }
}
