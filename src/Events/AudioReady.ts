import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class AudioReady extends BaseEvent<undefined> {
    constructor(callback: FromShopfrontCallbacks["AUDIO_READY"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(): Promise<FromShopfrontReturns["AUDIO_READY"]> {
        return this.callback(undefined, undefined);
    }
}
