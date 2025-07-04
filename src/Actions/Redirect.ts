import { Serialized } from "../Common/Serializable.js";
import { BaseAction } from "./BaseAction.js";

class InternalRedirect extends BaseAction<InternalRedirect> {
    protected supportedEvents = [ "click" ];

    protected to: string;

    constructor(to: Serialized<InternalRedirect> | string) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(typeof to === "string") {
                return {
                    properties: [ to ],
                    events    : {},
                    type      : "InternalRedirect",
                };
            } else {
                return to;
            }
        })(), InternalRedirect);

        if(typeof to !== "string") {
            this.to = to.properties[0] as string;
        } else {
            this.to = to;
        }
    }
}

class ExternalRedirect extends BaseAction<ExternalRedirect> {
    protected supportedEvents = [ "click" ];

    protected to: URL;

    constructor(to: Serialized<ExternalRedirect> | URL) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if(to instanceof URL) {
                return {
                    properties: [ to.href ],
                    events    : {},
                    type      : "ExternalRedirect",
                };
            } else {
                return to;
            }
        })(), ExternalRedirect);

        if(to instanceof URL) {
            this.to = to;
        } else {
            this.to = new URL(to.properties[0] as string);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Redirect = {
    InternalRedirect,
    ExternalRedirect,
};
