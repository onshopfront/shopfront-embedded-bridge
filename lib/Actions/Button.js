"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = require("./BaseAction");
class Button extends BaseAction_1.BaseAction {
    constructor(label, icon) {
        // https://github.com/Microsoft/TypeScript/issues/8277
        super((() => {
            if (typeof label === "string") {
                return {
                    properties: [label, icon],
                    events: {},
                    type: Button,
                };
            }
            else {
                return label;
            }
        })());
        this.supportedEvents = ["click"];
        if (typeof icon === "undefined") {
            label = label;
            this.label = label.properties[0];
            this.icon = label.properties[1];
        }
        else {
            this.label = label;
            this.icon = icon;
        }
    }
}
exports.Button = Button;
