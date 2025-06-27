import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class Callback extends BaseEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
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
