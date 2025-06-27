import { FromShopfrontCallbacks, FromShopfrontReturns, RegisterChangedEvent } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

interface ReadyData {
    outlet: string | null;
    register: string | null;
    user: string | null;
}

export class Ready extends BaseEvent<RegisterChangedEvent> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["READY"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: ReadyData): Promise<FromShopfrontReturns["READY"]> {
        return this.callback({
            outlet  : data.outlet,
            register: data.register,
            user    : data.user,
        }, undefined);
    }
}
