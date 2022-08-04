import { BaseEvent } from "./BaseEvent";
import { AudioPermissionChangeEvent, FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents";

export class AudioPermissionChange extends BaseEvent<AudioPermissionChangeEvent> {
    constructor(callback: FromShopfrontCallbacks["AUDIO_PERMISSION_CHANGE"]) {
        super(callback);
    }

    async emit(data: AudioPermissionChangeEvent): Promise<FromShopfrontReturns["AUDIO_PERMISSION_CHANGE"]> {
        this.callback(data, undefined);
    }
}
