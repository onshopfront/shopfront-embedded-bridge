import type {
    AudioPermissionChangeEvent,
    FromShopfrontCallbacks,
    FromShopfrontResponse,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class AudioPermissionChange extends BaseEvent<AudioPermissionChangeEvent> {
    constructor(callback: FromShopfrontCallbacks["AUDIO_PERMISSION_CHANGE"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: AudioPermissionChangeEvent): Promise<FromShopfrontResponse["AUDIO_PERMISSION_CHANGE"]> {
        return this.callback(data, undefined);
    }
}
