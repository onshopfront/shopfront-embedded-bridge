"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = require("./BaseAction");
class Toast extends BaseAction_1.BaseAction {
    constructor(type, message) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if (typeof type === "string") {
                return {
                    properties: [type, message],
                    events: {},
                    type: Toast,
                };
            }
            else {
                return type;
            }
        })());
        this.supportedEvents = ["hide"];
        if (typeof message === "undefined") {
            type = type;
            this.type = type.properties[0];
            this.message = type.properties[1];
        }
        else {
            this.type = type;
            this.message = message;
        }
    }
}
exports.Toast = Toast;
