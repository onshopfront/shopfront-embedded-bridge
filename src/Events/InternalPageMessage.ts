import {BaseEvent} from "./BaseEvent";
import {FromShopfront, FromShopfrontCallbacks, FromShopfrontReturns} from "../ApplicationEvents";
import {InternalMessageSource} from "../APIs/InternalMessages/InternalMessageSource";
import {Application} from "../Application";

export class InternalPageMessage extends BaseEvent {
    protected application: Application;

    constructor(callback: FromShopfrontCallbacks["INTERNAL_PAGE_MESSAGE"], application: Application) {
        super(callback);

        this.application = application;
    }

    protected createReference(method: keyof FromShopfront, url: string) {
        return new InternalMessageSource(
            this.application,
            method,
            url
        );
    }

    async emit(data: {
        method: keyof FromShopfront,
        url: string,
        message: any,
    }): Promise<FromShopfrontReturns["INTERNAL_PAGE_MESSAGE"]> {
        this.callback({
            method: data.method,
            url: data.url,
            message: data.message,
            reference: this.createReference(data.method, data.url)
        });
    }
}
