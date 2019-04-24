"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = require("./BaseAction");
class InternalRedirect extends BaseAction_1.BaseAction {
    constructor(to) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if (typeof to === "string") {
                return {
                    properties: [to],
                    events: {},
                    type: InternalRedirect,
                };
            }
            else {
                return to;
            }
        })());
        this.supportedEvents = ["click"];
        if (typeof to !== "string") {
            to = to;
            this.to = to.properties[0];
        }
        else {
            this.to = to;
        }
    }
}
class ExternalRedirect extends BaseAction_1.BaseAction {
    constructor(to) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if (to instanceof URL) {
                return {
                    properties: [to],
                    events: {},
                    type: ExternalRedirect,
                };
            }
            else {
                return to;
            }
        })());
        this.supportedEvents = ["click"];
        if (to instanceof URL) {
            this.to = to;
        }
        else {
            to = to;
            this.to = to.properties[0];
        }
    }
}
exports.Redirect = {
    InternalRedirect,
    ExternalRedirect
};
