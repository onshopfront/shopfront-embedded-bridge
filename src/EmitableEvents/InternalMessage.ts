import { InternalPageMessageMethod } from "../APIs/InternalMessages/InternalMessageSource.js";
import { ToShopfront } from "../ApplicationEvents.js";
import { BaseEmitableEvent } from "./BaseEmitableEvent.js";

export class InternalMessage<T> extends BaseEmitableEvent<{
    method: InternalPageMessageMethod;
    url: string;
    message: T;
}> {
    constructor(method: InternalPageMessageMethod, destination: string, message: T) {
        super(ToShopfront.INTERNAL_PAGE_MESSAGE, {
            method,
            url: destination,
            message,
        });
    }
}
