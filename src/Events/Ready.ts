import {FromShopfrontCallbacks} from "../ApplicationEvents";

export class Ready extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["READY"]) {
        super(callback);
    }

    async emit(data: {}): Promise<void> {
        return this.callback();
    }
}