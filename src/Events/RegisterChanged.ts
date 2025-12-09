import type {
    FromShopfrontCallbacks,
    FromShopfrontResponse,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

interface RegisterChangedData {
    outlet: string | null;
    register: string | null;
    user: string | null;
}

export class RegisterChanged extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REGISTER_CHANGED"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: RegisterChangedData): Promise<FromShopfrontResponse["REGISTER_CHANGED"]> {
        return this.callback(data, undefined);
    }
}
