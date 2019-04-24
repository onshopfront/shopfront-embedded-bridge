"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.supportedEvents = [];
        this.listeners = {};
    }
    addEventListener(event, callback) {
        if (!this.supportedEvents.includes(event)) {
            throw new TypeError(`${event} is not a supported event`);
        }
        if (typeof this.listeners[event] === "undefined") {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    removeEventListener(event, callback) {
        if (!this.supportedEvents.includes(event)) {
            throw new TypeError(`${event} is not a supported event`);
        }
        if (typeof this.listeners[event] === "undefined") {
            return;
        }
        const index = this.listeners[event].indexOf(callback);
        if (index === -1) {
            return;
        }
        this.listeners[event] = [
            ...this.listeners[event].slice(0, index),
            ...this.listeners[event].slice(index + 1),
        ];
    }
    async emit(event, ...args) {
        if (typeof this.listeners[event] === "undefined") {
            return Promise.resolve([]);
        }
        const events = [];
        for (let i = 0, l = this.listeners[event].length; i < l; i++) {
            events.push(this.listeners[event][i](...args));
        }
        return Promise.all(events);
    }
}
exports.EventEmitter = EventEmitter;
