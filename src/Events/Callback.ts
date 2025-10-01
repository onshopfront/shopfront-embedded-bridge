import { type FromShopfrontCallbacks, type FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class Callback extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["CALLBACK"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(): Promise<FromShopfrontReturns["CALLBACK"]> {
        return this.callback(undefined, undefined);
    }
}
