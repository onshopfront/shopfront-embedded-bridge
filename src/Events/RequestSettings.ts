import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {BaseEvent} from "./BaseEvent";
import {Bridge} from "../Bridge";

export class RequestSettings extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SETTINGS"]) {
        super(callback);
    }

    async emit(data: {}): Promise<FromShopfrontReturns["REQUEST_SETTINGS"]> {
        const result = await Promise.resolve(this.callback());

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(bridge: Bridge, settings: Array<FromShopfrontReturns["REQUEST_SETTINGS"]>, id: string) {
        if(settings.length > 1) {
            throw new Error("Multiple settings responses found, please ensure you are only subscribed to REQUEST_SETTINGS once");
        }

        bridge.sendMessage(ToShopfront.RESPONSE_SETTINGS, {
            id,
            settings: settings[0],
        });
    }
}