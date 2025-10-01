import type { Serialized } from "../Common/Serializable.js";
import { BaseAction } from "./BaseAction.js";

export type ToastType = "success" | "error" | "information" | "warning";

export class Toast extends BaseAction<Toast> {
    protected supportedEvents = [ "hide" ];

    protected type: ToastType;
    protected message: string;

    constructor(type: Serialized<Toast> | ToastType, message?: string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof type === "string") {
                return {
                    properties: [ type, message ],
                    events    : {},
                    type      : "Toast",
                };
            } else {
                return type;
            }
        })(), Toast);

        if(typeof message === "undefined") {
            type = type as Serialized<Toast>;
            this.type = type.properties[0] as ToastType;
            this.message = type.properties[1] as string;
        } else {
            this.type = type as ToastType;
            this.message = message;
        }
    }
}
