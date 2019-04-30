import {BaseAction} from "./BaseAction";
import {SerializableType, Serialized} from "../Common/Serializable";

class InternalRedirect extends BaseAction<InternalRedirect> {
    protected supportedEvents = ["click"];

    protected to: string;

    constructor(to: Serialized<InternalRedirect> | string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof to === "string") {
                return {
                    properties: [to],
                    events    : {},
                    type      : "InternalRedirect"
                }
            } else {
                return to;
            }
        })(), InternalRedirect);

        if(typeof to !== "string") {
            to      = to as Serialized<InternalRedirect>;
            this.to = to.properties[0];
        } else {
            this.to = to;
        }
    }
}

class ExternalRedirect extends BaseAction<ExternalRedirect> {
    protected supportedEvents = ["click"];

    protected to: URL;

    constructor(to: Serialized<ExternalRedirect> | URL) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(to instanceof URL) {
                return {
                    properties: [to],
                    events    : {},
                    type      : "ExternalRedirect",
                }
            } else {
                return to;
            }
        })(), ExternalRedirect);

        if(to instanceof URL) {
            this.to = to;
        } else {
            to      = to as Serialized<ExternalRedirect>;
            this.to = to.properties[0];
        }
    }
}

export const Redirect = {
    InternalRedirect,
    ExternalRedirect
};