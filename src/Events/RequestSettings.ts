import {FromShopfrontCallbacks} from "../ApplicationEvents";

export class RequestSettings extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SETTINGS"]) {
        super(callback);
    }

    async emit(data: {}): Promise<void> {
        return this.callback();
    }
}