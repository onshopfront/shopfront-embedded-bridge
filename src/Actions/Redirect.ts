import {BaseAction} from "./BaseAction";
import {SerializableType, Serialized} from "../Common/Encodable";

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
                    type      : InternalRedirect as unknown as SerializableType<InternalRedirect>, // Required to get around the type checker for the moment
                }
            } else {
                return to;
            }
        })());

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
                    type      : ExternalRedirect as unknown as SerializableType<ExternalRedirect>, // Required to get around the type checker for the moment
                }
            } else {
                return to;
            }
        })());

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