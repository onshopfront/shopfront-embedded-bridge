import { Button } from "../Actions/Button.js";
import { FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront } from "../ApplicationEvents.js";
import { Bridge } from "../Bridge.js";
import { MaybePromise } from "../Utilities/MiscTypes.js";
import { BaseEvent } from "./BaseEvent.js";

interface RequestButtonsData {
    location: string;
    id: string;
    context: unknown;
}

export class RequestButtons extends BaseEvent<
    RequestButtonsData,
    MaybePromise<FromShopfrontReturns["REQUEST_BUTTONS"]>,
    MaybePromise<FromShopfrontReturns["REQUEST_BUTTONS"]>,
    string,
    unknown
> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(callback: FromShopfrontCallbacks["REQUEST_BUTTONS"]) {
        super(callback);
    }

    /**
     * @inheritDoc
     * @param data
     */
    public async emit(data: RequestButtonsData): Promise<FromShopfrontReturns["REQUEST_BUTTONS"]> {
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
     * @param bridge
     * @param buttons
     * @param id
     */
    public static async respond(bridge: Bridge, buttons: Array<Button>, id: string): Promise<void> {
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
