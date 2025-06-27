import { Serialized } from "../Common/Serializable.js";
import { BaseAction } from "./BaseAction.js";

export class Button extends BaseAction<Button> {
    protected supportedEvents = [ "click" ];

    protected label: string;
    protected icon: string;

    constructor(label: Serialized<Button> | string, icon?: string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof label === "string") {
                return {
                    properties: [ label, icon ],
                    events    : {},
                    type      : "Button",
                };
            } else {
                return label;
            }
        })(), Button);

        if(typeof icon === "undefined" && typeof label !== "string") {
            this.label = label.properties[0] as string;
            this.icon  = label.properties[1] as string;
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
