import { AudioPermissionChangeEvent, FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

export class AudioPermissionChange extends BaseEvent<AudioPermissionChangeEvent> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["AUDIO_PERMISSION_CHANGE"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: AudioPermissionChangeEvent): Promise<FromShopfrontReturns["AUDIO_PERMISSION_CHANGE"]> {
        this.callback(data, undefined);
    }
}
