import {FromShopfrontCallbacks, FromShopfrontReturns} from "../ApplicationEvents";
import {BaseEvent} from "./BaseEvent";

export class Ready extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["READY"]) {
        super(callback);
    }

    async emit(data: {}): Promise<FromShopfrontReturns["READY"]> {
        return this.callback();
    }
}