import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
    ReadyEvent,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

interface ReadyData {
    outlet: string | null;
    register: string | null;
    vendor: string;
}

export class Ready extends BaseEvent<ReadyEvent> {
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
            vendor  : data.vendor,
        }, undefined);
    }
}
