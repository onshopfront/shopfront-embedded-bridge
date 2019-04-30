import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {Bridge, Button} from "..";
import {BaseEvent} from "./BaseEvent";

export class RequestButtons extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_BUTTONS"]) {
        super(callback);
    }

    public async emit(data: {location: string, id: string, context: any}): Promise<FromShopfrontReturns["REQUEST_BUTTONS"]> {
        let result = await Promise.resolve(this.callback(data.location, data.context));

        if(!Array.isArray(result)) {
            result = [result];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!(result[i] instanceof Button)) {
                throw new TypeError("You must return an instance of Button");
            }
        }

        return result;
    }

    public static async respond(bridge: Bridge, buttons: Array<Button>, id: string): Promise<void> {
        let response = [];
        for(let i = 0, l = buttons.length; i < l; i++) {
            if(!(buttons[i] instanceof Button)) {
                throw new TypeError("Invalid response returned, expected button");
            }

            response.push(buttons[i].serialize());
        }

        bridge.sendMessage(ToShopfront.RESPONSE_BUTTONS, response, id);
    }
}