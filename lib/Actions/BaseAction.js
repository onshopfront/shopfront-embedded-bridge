"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1;
"use strict";
const EventEmitter_1 = require("../Common/EventEmitter");
const Static_1 = require("../Utilities/Static");
const ActionEventRegistrar_1 = __importDefault(require("../Utilities/ActionEventRegistrar"));
let BaseAction = BaseAction_1 = class BaseAction extends EventEmitter_1.EventEmitter {
    constructor(serialized) {
        if (new.target === BaseAction_1) {
            throw new TypeError("You cannot construct BaseAction instances directly");
        }
        super();
        this.target = serialized.type;
        this.events = [];
        this.properties = serialized.properties;
    }
    serialize() {
        const events = {};
        for (let i = 0, l = this.events.length; i < l; i++) {
            if (typeof events[this.events[i].type] === "undefined") {
                events[this.events[i].type] = [];
            }
            events[this.events[i].type].push(this.events[i].id);
        }
        return {
            properties: this.properties,
            events: events,
            type: this.target,
        };
    }
    static deserialize(serialized) {
        return new serialized.type(serialized);
    }
    addEventListener(event, callback) {
        super.addEventListener(event, callback);
        const id = `${Date.now()}-${event}-${Math.random()}`;
        ActionEventRegistrar_1.default.add(id, this);
        this.events.push({
            id,
            callback,
            type: event,
        });
    }
    removeEventListener(event, callback) {
        super.removeEventListener(event, callback);
        for (let i = 0, l = this.events.length; i < l; i++) {
            if (this.events[i].type !== event) {
                continue;
            }
            if (this.events[i].callback !== callback) {
                continue;
            }
            const id = this.events[i].id;
            ActionEventRegistrar_1.default.remove(id);
            this.events = [
                ...this.events.slice(0, i),
                ...this.events.slice(i + 1),
            ];
            break;
        }
    }
    handleRegistrarEvent(id, data) {
        for (let i = 0, l = this.events.length; i < l; i++) {
            if (this.events[i].id !== id) {
                continue;
            }
            this.events[i].callback(data);
            this.removeEventListener(this.events[i].type, this.events[i].callback);
            break;
        }
    }
};
BaseAction = BaseAction_1 = __decorate([
    Static_1.staticImplements()
], BaseAction);
exports.BaseAction = BaseAction;
