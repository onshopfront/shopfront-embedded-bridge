import {BaseEvent} from "./BaseEvent";
import {FromShopfrontCallbacks, FromShopfrontReturns} from "../ApplicationEvents";

export class RegisterChanged extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REGISTER_CHANGED"]) {
        super(callback);
    }

    async emit(data: {
        outlet: string | null,
        register: string | null,
    }): Promise<FromShopfrontReturns["REGISTER_CHANGED"]> {
        this.callback(data, undefined);
    }
}
