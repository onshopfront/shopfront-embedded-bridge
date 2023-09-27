import { BaseEvent } from "./BaseEvent";
import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents";

export class AudioReady extends BaseEvent<undefined> {
    constructor(callback: FromShopfrontCallbacks["AUDIO_READY"]) {
        super(callback);
    }

    async emit(): Promise<FromShopfrontReturns["AUDIO_READY"]> {
        this.callback(undefined, undefined);
    }
}
