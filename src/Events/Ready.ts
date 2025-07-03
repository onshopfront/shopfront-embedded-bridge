import { FromShopfrontCallbacks, FromShopfrontReturns, RegisterChangedEvent } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

interface ReadyData {
    outlet: string | null;
    register: string | null;
    user: string | null;
}

export class Ready extends BaseEvent<RegisterChangedEvent> {
    constructor(callback: FromShopfrontCallbacks["READY"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: ReadyData): Promise<FromShopfrontReturns["READY"]> {
        return this.callback({
            outlet  : data.outlet,
            register: data.register,
            user    : data.user,
        }, undefined);
    }
}
