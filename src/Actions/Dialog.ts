import { Serialized } from "../Common/Serializable.js";
import { BaseAction } from "./BaseAction.js";
import { Button } from "./Button.js";

type DialogType = "success" | "information" | "question" | "danger" | "warning" | "error" | "edit" | "frame";

export class Dialog extends BaseAction<Dialog> {
    protected supportedEvents = [ "close" ];

    protected type: DialogType;
    protected closeable: boolean;
    protected header: string;
    protected content: string;
    protected buttons: Array<Button>;

    constructor(
        type: Serialized<Dialog> | DialogType,
        closeable?: boolean,
        header?: string,
        content?: string,
        buttons?: Array<Button>
    ) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof type === "string") {
                return {
                    properties: [ type, closeable, header, content, buttons ],
                    events    : {},
                    type      : "Dialog",
                };
            } else {
                return type;
            }
        })(), Dialog);

        if(typeof header === "undefined") {
            type = type as Serialized<Dialog>;
            this.type = type.properties[0] as DialogType;
            this.closeable = type.properties[1] as boolean;
            this.header = type.properties[2] as string;
            this.content = type.properties[3] as string;
            this.buttons = type.properties[4] as Array<Button>; // Note: This should be deserialized
        } else {
            this.type = type as DialogType;
            this.closeable = closeable as boolean;
            this.header = header as string;
            this.content = content as string;
            this.buttons = buttons as Array<Button>;
        }
    }
}
