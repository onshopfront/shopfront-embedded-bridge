import {Application} from "../../Application";
import {InternalMessage} from "../../EmitableEvents/InternalMessage";
import {FromShopfront} from "../../ApplicationEvents";

export class InternalMessageSource {
    protected application: Application;
    protected method: keyof FromShopfront;
    protected url: string;

    constructor(application: Application, method: keyof FromShopfront, url: string) {
        this.application = application;
        this.method = method;
        this.url = url;
    }

    public send(message: any) {
        this.application.send(new InternalMessage(this.method, this.url, message));
    }
}
