import {Application} from "../../Application";
import {InternalMessage} from "../../EmitableEvents/InternalMessage";
import {FromShopfront} from "../../ApplicationEvents";

export type InternalPageMessageMethod = keyof FromShopfront | "EXTERNAL_APPLICATION";

export class InternalMessageSource {
    protected application: Application;
    protected method: InternalPageMessageMethod;
    protected url: string;

    constructor(application: Application, method: InternalPageMessageMethod, url: string) {
        this.application = application;
        this.method = method;
        this.url = url;
    }

    public send(message: any) {
        this.application.send(new InternalMessage(this.method, this.url, message));
    }
}
