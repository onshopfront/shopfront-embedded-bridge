import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {BaseEvent} from "./BaseEvent";
import {Bridge} from "../Bridge";

export class RequestTableColumns extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_TABLE_COLUMNS"]) {
        super(callback);
    }

    async emit(data: {location: string, context: any}): Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]> {
        const result = await Promise.resolve(this.callback(data.location, data.context));

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(bridge: Bridge, settings: Array<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>, id: string) {
        if(settings.length > 1) {
            throw new Error("Multiple table column responses found, please ensure you are only subscribed to REQUEST_TABLE_COLUMNS once");
        }

        bridge.sendMessage(ToShopfront.RESPONSE_TABLE_COLUMNS, settings[0], id);
    }
}
