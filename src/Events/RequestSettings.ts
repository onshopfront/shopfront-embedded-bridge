import {
    type FromShopfrontCallbacks,
    type FromShopfrontResponse,
    ToShopfront,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseBridge } from "../BaseBridge.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

export class RequestSettings extends BaseEvent<
    undefined,
    MaybePromise<FromShopfrontResponse["REQUEST_SETTINGS"]>,
    FromShopfrontResponse["REQUEST_SETTINGS"]
> {
    constructor(callback: FromShopfrontCallbacks["REQUEST_SETTINGS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(_: never): Promise<FromShopfrontResponse["REQUEST_SETTINGS"]> {
        const result = await this.callback(undefined, undefined);

        if(typeof result !== "object" || result === null) {
            throw new TypeError("Callback must return an object");
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(
        bridge: BaseBridge,
        settings: Array<FromShopfrontResponse["REQUEST_SETTINGS"]>,
        id: string
    ): Promise<void> {
        if(settings.length > 1) {
            throw new Error(
                "Multiple settings responses found, " +
                "please ensure you are only subscribed to REQUEST_SETTINGS once"
            );
        }

        bridge.sendMessage(ToShopfront.RESPONSE_SETTINGS, settings[0], id);
    }
}
