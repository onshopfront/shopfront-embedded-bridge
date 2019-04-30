import {BaseAction} from "./BaseAction";
import {Serialized} from "../Common/Serializable";

export class Button extends BaseAction<Button> {
    protected supportedEvents = ["click"];

    protected label: string;
    protected icon : string;

    constructor(label: Serialized<Button> | string, icon?: string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof label === "string") {
                return {
                    properties: [label, icon],
                    events    : {},
                    type      : "Button"
                }
            } else {
                return label;
            }
        })(), Button);

        if(typeof icon === "undefined" && typeof label !== "string") {
            label      = label as Serialized<Button>;
            this.label = label.properties[0];
            this.icon  = label.properties[1];
        } else {
            this.label = label as string;

            if(typeof icon === "undefined") {
                this.icon = "";
            } else {
                this.icon = icon;
            }
        }
    }
}