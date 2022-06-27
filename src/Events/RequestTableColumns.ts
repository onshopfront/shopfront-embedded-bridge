import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {BaseEvent} from "./BaseEvent";
import {Bridge} from "../Bridge";
import { MaybePromise } from "../Utilities/MiscTypes";

export class RequestTableColumns extends BaseEvent<
    { location: string; context: unknown },
    MaybePromise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>,
    FromShopfrontReturns["REQUEST_TABLE_COLUMNS"],
    string,
    unknown
> {
    constructor(callback: FromShopfrontCallbacks["REQUEST_TABLE_COLUMNS"]) {
        super(callback);
    }

    async emit(data: { location: string, context: unknown }): Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]> {
        const result = await this.callback(data.location, data.context);

        if(typeof result !== "object") {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    public static async respond(bridge: Bridge, columns: Array<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>, id: string) {
        columns = columns.filter(column => column !== null);

        if(columns.length > 1) {
            throw new Error("Multiple table column responses found, please ensure you are only subscribed to REQUEST_TABLE_COLUMNS once");
        }

        bridge.sendMessage(ToShopfront.RESPONSE_TABLE_COLUMNS, columns[0], id);
    }
}
