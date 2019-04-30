import {FromShopfrontCallbacks, FromShopfrontReturns} from "../ApplicationEvents";
import {BaseEvent} from "./BaseEvent";

export class Callback extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["CALLBACK"]) {
        super(callback);
    }

    async emit(data: {}): Promise<FromShopfrontReturns["CALLBACK"]> {
        return this.callback();
    }
}