import {FromShopfrontCallbacks} from "../ApplicationEvents";
import {Button} from "..";

export class RequestButtons extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_BUTTONS"]) {
        super(callback);
    }

    async emit(data: {}): Promise<void> {
        let result = await Promise.resolve(this.callback());

        if(!Array.isArray(result)) {
            result = [result];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!(result[i] instanceof Button)) {
                throw new TypeError("You must return an instance of Button");
            }
        }

        // TODO: Fire Event
    }
}