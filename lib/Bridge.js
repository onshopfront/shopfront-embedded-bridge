"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./Application");
const ApplicationEvents = __importStar(require("./ApplicationEvents"));
class Bridge {
    constructor(key, url) {
        this.listeners = [];
        this.hasListener = false;
        this.target = null;
        if (window.parent === window) {
            throw new Error("The bridge has not been initialised within a frame");
        }
        this.key = key;
        if (url.split('.').length === 1) {
            this.url = new URL(`https://${url}.onshopfront.com`);
        }
        else {
            this.url = new URL(url);
        }
        this.registerListeners();
        this.sendMessage(ApplicationEvents.ToShopfront.READY);
    }
    static createApplication(options) {
        if (typeof options.id === "undefined") {
            throw new TypeError("You must specify the ID for the application");
        }
        if (typeof options.vendor === "undefined") {
            throw new TypeError("You must specify the Vendor for the application");
        }
        return new Application_1.Application(new Bridge(options.id, options.vendor));
    }
    destroy() {
        this.unregisterListeners();
        this.listeners = [];
    }
    registerListeners() {
        window.addEventListener("message", this.handleMessage);
    }
    unregisterListeners() {
        window.removeEventListener("message", this.handleMessage);
    }
    handleMessage(event) {
        if (event.origin !== this.url.origin) {
            return;
        }
        if (typeof event.data.type !== "string") {
            return;
        }
        if (this.target === null) {
            if (window.parent !== event.source) {
                // Not from the parent frame
                return;
            }
        }
        else {
            if (event.source !== this.target) {
                // Not from the source we want
                return;
            }
        }
        // Emit the event
        for (let i = 0, l = this.listeners.length; i < l; i++) {
            this.listeners[i](event.data.type, event.data.data);
        }
    }
    sendMessage(type, data) {
        if (type === ApplicationEvents.ToShopfront.READY) {
            if (typeof data !== "undefined") {
                throw new TypeError("The `data` parameter must be undefined when requesting ready state");
            }
            if (this.target !== null) {
                throw new Error("Shopfront is already ready");
            }
            window.parent.postMessage({
                type,
            }, this.url.origin);
            return;
        }
        if (this.target === null) {
            throw new Error("Shopfront is not ready");
        }
        this.target.parent.postMessage({
            type,
            data
        }, this.url.origin);
    }
    addEventListener(listener) {
        if (this.listeners.includes(listener)) {
            throw new Error("The listener provided is already registered");
        }
        this.listeners.push(listener);
        if (!this.hasListener) {
            this.sendMessage(ApplicationEvents.ToShopfront.READY);
            this.hasListener = true;
        }
    }
    removeEventListener(listener) {
        let index = this.listeners.indexOf(listener);
        if (index === -1) {
            return;
        }
        this.listeners = [
            ...this.listeners.slice(0, index),
            ...this.listeners.slice(index + 1),
        ];
    }
}
exports.Bridge = Bridge;
