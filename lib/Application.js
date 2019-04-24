"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationEvents_1 = require("./ApplicationEvents");
const Ready_1 = require("./Events/Ready");
const Button_1 = require("./Actions/Button");
const RequestSettings_1 = require("./Events/RequestSettings");
const RequestButtons_1 = require("./Events/RequestButtons");
class Application {
    constructor(bridge) {
        this.listeners = {
            READY: new Map(),
            REQUEST_SETTINGS: new Map(),
            REQUEST_BUTTONS: new Map(),
        };
        this.bridge = bridge;
        this.isReady = false;
        this.bridge.addEventListener(this.handleEvent);
    }
    destroy() {
        this.bridge.destroy();
    }
    handleEvent(event, data) {
        if (event === "READY") {
            this.isReady = true;
        }
        this.emit(event, data);
    }
    emit(event, data = {}) {
        let results = [];
        for (let e of this.listeners[event].values()) {
            results.push(e.emit(data));
        }
        // Respond if necessary
        switch (event) {
            case "REQUEST_BUTTONS":
                results = results;
                return Promise.all(results)
                    .then((res) => {
                    return RequestButtons_1.RequestButtons.respond(this.bridge, res.flat(), data.id);
                });
            case "REQUEST_SETTINGS":
                results = results;
                return Promise.all(results)
                    .then((res) => {
                    return RequestSettings_1.RequestSettings.respond(this.bridge, res.flat(), data.id);
                });
        }
    }
    addEventListener(event, callback) {
        let c = null;
        switch (event) {
            case "READY":
                c = new Ready_1.Ready(callback);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_SETTINGS":
                c = new RequestSettings_1.RequestSettings(callback);
                this.listeners[event].set(callback, c);
                break;
            case "REQUEST_BUTTONS":
                c = new RequestButtons_1.RequestButtons(callback);
                this.listeners[event].set(callback, c);
                break;
        }
        if (c === null) {
            throw new TypeError(`${event} has not been defined`);
        }
        if (event === "READY" && this.isReady) {
            c = c;
            c.emit({});
        }
    }
    removeEventListener(event, callback) {
        this.listeners[event].delete(callback);
    }
    send(item) {
        if (item instanceof Button_1.Button) {
            throw new TypeError("You cannot send Buttons to Shopfront without Shopfront requesting them");
        }
        const serialized = item.serialize();
        this.bridge.sendMessage(ApplicationEvents_1.ToShopfront.SERIALIZED, serialized);
    }
}
exports.Application = Application;
