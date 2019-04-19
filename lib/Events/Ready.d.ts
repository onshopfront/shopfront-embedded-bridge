import { FromShopfrontCallbacks } from "../ApplicationEvents";
export declare class Ready extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["READY"]);
    emit(data: {}): Promise<void>;
}
