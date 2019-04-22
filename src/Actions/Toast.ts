import {BaseAction} from "./BaseAction";
import {SerializableType, Serialized} from "../Common/Encodable";

type ToastType = "success" | "error" | "information" | "warning";

export class Toast extends BaseAction<Toast> {
    protected supportedEvents = ["hide"];

    protected type   : ToastType;
    protected message: string;

    constructor(type: Serialized<Toast> | ToastType, message?: string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof type === "string") {
                return {
                    properties: [type, message],
                    events    : {},
                    type      : Toast as unknown as SerializableType<Toast>, // Required to get around the type checker for the moment
                }
            } else {
                return type;
            }
        })());

        if(typeof message === "undefined") {
            type         = type as Serialized<Toast>;
            this.type    = type.properties[0];
            this.message = type.properties[1];
        } else {
            this.type    = type as ToastType;
            this.message = message;
        }
    }
}