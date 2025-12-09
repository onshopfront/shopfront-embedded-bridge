import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
    RegisterChangedEvent,
} from "../ApplicationEvents/ToShopfront.js";
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
    public async emit(data: ReadyData): Promise<FromShopfrontResponse["READY"]> {
        return this.callback({
            outlet  : data.outlet,
            register: data.register,
            user    : data.user,
        }, undefined);
    }
}
