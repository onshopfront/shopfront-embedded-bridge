import {BaseAction} from "./BaseAction";
import {Serialized} from "../Common/Serializable";

export class SaleKey extends BaseAction<SaleKey> {
    protected supportedEvents = ["click"];

    protected id: string;
    protected name: string;

    constructor(id: Serialized<SaleKey> | string, name?: string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof id === "string") {
                return {
                    properties: [id, name],
                    events    : {},
                    type      : "Button"
                }
            } else {
                return id;
            }
        })(), SaleKey);

        if(typeof name === "undefined" && typeof id !== "string") {
            id      = id as Serialized<SaleKey>;
            this.id = id.properties[0];
            this.name  = id.properties[1];
        } else {
            this.id = id as string;

            if(typeof name === "undefined") {
                this.name = "";
            } else {
                this.name = name;
            }
        }
    }
}
