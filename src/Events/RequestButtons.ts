import { Button } from "../Actions/Button.js";
import {
    type FromShopfrontCallbacks,
    type FromShopfrontResponse,
    ToShopfront,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseBridge } from "../BaseBridge.js";
import { type MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface RequestButtonsData {
    location: string;
    id: string;
    context: unknown;
}

export class RequestButtons extends BaseEvent<
    RequestButtonsData,
    MaybePromise<FromShopfrontResponse["REQUEST_BUTTONS"]>,
    MaybePromise<FromShopfrontResponse["REQUEST_BUTTONS"]>,
    string,
    unknown
> {
    constructor(callback: FromShopfrontCallbacks["REQUEST_BUTTONS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     */
    public async emit(data: RequestButtonsData): Promise<FromShopfrontResponse["REQUEST_BUTTONS"]> {
        let result = await this.callback(data.location, data.context);

        if(!Array.isArray(result)) {
            result = [ result ];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!(result[i] instanceof Button)) {
                throw new TypeError("You must return an instance of Button");
            }
        }

        return result;
    }

    /**
     * Sends the response data to Shopfront
     */
    public static async respond(bridge: BaseBridge, buttons: Array<Button>, id: string): Promise<void> {
        const response = [];

        for(let i = 0, l = buttons.length; i < l; i++) {
            if(!(buttons[i] instanceof Button)) {
                throw new TypeError("Invalid response returned, expected button");
            }

            response.push(buttons[i].serialize());
        }

        bridge.sendMessage(ToShopfront.RESPONSE_BUTTONS, response, id);
    }
}
