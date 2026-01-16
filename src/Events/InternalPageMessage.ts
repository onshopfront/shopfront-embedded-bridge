import { InternalMessageSource } from "../APIs/InternalMessages/InternalMessageSource.js";
import { Application } from "../Application.js";
import type {
    FromShopfront,
    FromShopfrontCallbacks,
    FromShopfrontResponse,
    InternalPageMessageEvent,
} from "../ApplicationEvents/ToShopfront.js";
import { BaseEvent } from "./BaseEvent.js";

export class InternalPageMessage extends BaseEvent<InternalPageMessageEvent> {
    protected application: Application;

    constructor(callback: FromShopfrontCallbacks["INTERNAL_PAGE_MESSAGE"], application: Application) {
        super(callback);

        this.application = application;
    }

    /**
     * Creates and returns a new internal message source
     */
    protected createReference(
        method: keyof FromShopfront | "EXTERNAL_APPLICATION" | "PAYMENT_API",
        url: string
    ): InternalMessageSource {
        return new InternalMessageSource(
            this.application,
            method,
            url
        );
    }

    /**
     * @inheritDoc
     */
    public async emit(data: InternalPageMessageEvent): Promise<FromShopfrontResponse["INTERNAL_PAGE_MESSAGE"]> {
        return this.callback({
            method   : data.method,
            url      : data.url,
            message  : data.message,
            reference: this.createReference(data.method, data.url),
        }, undefined);
    }
}
