import { BaseAction } from "./BaseAction";
import { Serialized } from "../Common/Serializable";
declare class InternalRedirect extends BaseAction<InternalRedirect> {
    protected supportedEvents: string[];
    protected to: string;
    constructor(to: Serialized<InternalRedirect> | string);
}
declare class ExternalRedirect extends BaseAction<ExternalRedirect> {
    protected supportedEvents: string[];
    protected to: URL;
    constructor(to: Serialized<ExternalRedirect> | URL);
}
export declare const Redirect: {
    InternalRedirect: typeof InternalRedirect;
    ExternalRedirect: typeof ExternalRedirect;
};
export {};
