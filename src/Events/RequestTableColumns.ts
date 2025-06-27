import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface RequestTableColumnsData {
    location: string;
    context: unknown;
}

export class RequestTableColumns extends BaseEvent<
    RequestTableColumnsData,
    MaybePromise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>,
    FromShopfrontReturns["REQUEST_TABLE_COLUMNS"],
    string,
    unknown
> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["REQUEST_TABLE_COLUMNS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: RequestTableColumnsData): Promise<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]> {
        const result = await this.callback(data.location, data.context);

        if(typeof result !== "object") {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     * @param bridge
     * @param columns
     * @param id
     */
    public static async respond(
        bridge: Bridge,
        columns: Array<FromShopfrontReturns["REQUEST_TABLE_COLUMNS"]>,
        id: string
    ): Promise<void> {
        columns = columns.filter(column => column !== null);

        if(columns.length > 1) {
            throw new Error(
                "Multiple table column responses found," +
                "please ensure you are only subscribed to REQUEST_TABLE_COLUMNS once"
            );
        }

        bridge.sendMessage(ToShopfront.RESPONSE_TABLE_COLUMNS, columns[0], id);
    }
}
