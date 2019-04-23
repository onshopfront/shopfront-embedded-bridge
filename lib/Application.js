"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ready_1 = require("./Events/Ready");
class Application {
    constructor(bridge) {
        this.listeners = {
            READY: new Map(),
        };
        this.bridge = bridge;
        this.isReady = false;
        this.bridge.addEventListener(this.handleEvent);
    }
    destroy() {
        this.bridge.destroy();
    }
    handleEvent(event, data) {
        switch (event) {
            case "READY":
                this.ready();
                break;
        }
    }
    ready() {
        this.isReady = true;
        this.emit("READY");
    }
    emit(event, data = {}) {
        for (let e of this.listeners[event].values()) {
            e.emit(data);
        }
    }
    addEventListener(event, callback) {
        let c = null;
        switch (event) {
            case "READY":
                c = new Ready_1.Ready(callback);
                break;
        }
        if (c === null) {
            throw new TypeError(`${event} has not been defined`);
        }
        this.listeners[event].set(callback, c);
        if (event === "READY" && this.isReady) {
            c.emit({});
        }
    }
    removeEventListener(event, callback) {
        this.listeners[event].delete(callback);
    }
}
exports.Application = Application;
