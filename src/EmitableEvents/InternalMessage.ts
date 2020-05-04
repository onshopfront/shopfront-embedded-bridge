import {BaseEmitableEvent} from "./BaseEmitableEvent";
import {FromShopfront, ToShopfront} from "../ApplicationEvents";

export class InternalMessage<T> extends BaseEmitableEvent<{
    method: string,
    url: string,
    message: T,
}> {
    constructor(method: keyof FromShopfront, destination: string, message: T) {
        super(ToShopfront.INTERNAL_PAGE_MESSAGE, {
            method,
            url: destination,
            message,
        });
    }
}
