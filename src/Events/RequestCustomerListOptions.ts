import {FromShopfrontCallbacks, FromShopfrontReturns, ToShopfront} from "../ApplicationEvents";
import {Bridge} from "..";
import {BaseEvent} from "./BaseEvent";
import { CustomerListOption } from "../Actions/CustomerListOption";

export interface SellScreenCustomerListOption {
    contents: string,
    onClick: () => void,
}

export class RequestCustomerListOptions extends BaseEvent {
    constructor(callback: FromShopfrontCallbacks["REQUEST_CUSTOMER_LIST_OPTIONS"]) {
        super(callback);
    }

    public async emit(data: {}): Promise<FromShopfrontReturns["REQUEST_CUSTOMER_LIST_OPTIONS"]> {
        let result = await Promise.resolve(this.callback());

        if(!Array.isArray(result)) {
            result = [result];
        }

        for(let i = 0, l = result.length; i < l; i++) {
            if(!result[i].contents || !result[i].onClick) {
                throw new TypeError("You must specify both the contents and an onClick callback");
            }
        }

        return result;
    }

    public static async respond(bridge: Bridge, options: Array<SellScreenCustomerListOption>, id: string): Promise<void> {
        bridge.sendMessage(
            ToShopfront.RESPONSE_CUSTOMER_LIST_OPTIONS,
            options.map(option => {
                const o = new CustomerListOption(option.contents);
                o.addEventListener("click", option.onClick);
                return o.serialize();
            }),
            id
        );
    }
}
