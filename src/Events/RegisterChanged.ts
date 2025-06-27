import { FromShopfrontCallbacks, FromShopfrontReturns } from "../ApplicationEvents.js";
import { BaseEvent } from "./BaseEvent.js";

interface RegisterChangedData {
    outlet: string | null;
    register: string | null;
    user: string | null;
}

export class RegisterChanged extends BaseEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["REGISTER_CHANGED"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: RegisterChangedData): Promise<FromShopfrontReturns["REGISTER_CHANGED"]> {
        this.callback(data, undefined);
    }
}
