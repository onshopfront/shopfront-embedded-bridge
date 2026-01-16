import { Application } from "../../Application.js";
import { type FromShopfront } from "../../ApplicationEvents/ToShopfront.js";
import { InternalMessage } from "../../EmitableEvents/InternalMessage.js";

export type InternalPageMessageMethod = keyof FromShopfront | "EXTERNAL_APPLICATION" | "PAYMENT_API";

export class InternalMessageSource {
    protected application: Application;
    protected method: InternalPageMessageMethod;
    protected url: string;

    constructor(application: Application, method: InternalPageMessageMethod, url: string) {
        this.application = application;
        this.method = method;
        this.url = url;
    }

    /**
     * Sends an internal message to Shopfront
     */
    public send(message: unknown): void {
        this.application.send(new InternalMessage(this.method, this.url, message));
    }
}
