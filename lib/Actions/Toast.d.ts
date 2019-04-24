import { BaseAction } from "./BaseAction";
import { Serialized } from "../Common/Serializable";
declare type ToastType = "success" | "error" | "information" | "warning";
export declare class Toast extends BaseAction<Toast> {
    protected supportedEvents: string[];
    protected type: ToastType;
    protected message: string;
    constructor(type: Serialized<Toast> | ToastType, message?: string);
}
export {};
