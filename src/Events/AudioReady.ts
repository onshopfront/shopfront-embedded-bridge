import { type FromShopfrontCallbacks, type FromShopfrontResponse } from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class AudioReady extends BaseEvent<undefined> {
    constructor(callback: FromShopfrontCallbacks["AUDIO_READY"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(): Promise<FromShopfrontResponse["AUDIO_READY"]> {
        return this.callback(undefined, undefined);
    }
}
