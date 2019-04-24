import { BaseAction } from "./BaseAction";
import { Serialized } from "../Common/Serializable";
export declare class Button extends BaseAction<Button> {
    protected supportedEvents: string[];
    protected label: string;
    protected icon: string;
    constructor(label: Serialized<Button> | string, icon?: string);
}
