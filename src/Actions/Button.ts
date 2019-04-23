import {BaseAction} from "./BaseAction";
import {SerializableType, Serialized} from "../Common/Serializable";

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
                    type      : Button as unknown as SerializableType<Button>, // Required to get around the type checker for the moment
                }
            } else {
                return label;
            }
        })());

        if(typeof icon === "undefined") {
            label      = label as Serialized<Button>;
            this.label = label.properties[0];
            this.icon  = label.properties[1];
        } else {
            this.label = label as string;
            this.icon  = icon;
        }
    }
}