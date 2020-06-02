import {FromShopfrontCallbacks, FromShopfrontReturns} from "../ApplicationEvents";
import {BaseEvent} from "./BaseEvent";

export class Ready extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["READY"]) {
        super(callback);
    }

    async emit(data: {
        outlet: string | null,
        register: string | null,
        user: string | null,
    }): Promise<FromShopfrontReturns["READY"]> {
        return this.callback({
            outlet: data.outlet,
            register: data.register,
            user: data.user,
        });
    }
}
