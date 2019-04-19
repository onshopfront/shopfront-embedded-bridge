"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ready extends BaseEvent {
    constructor(callback) {
        super(callback);
    }
    async emit(data) {
        return this.callback();
    }
}
exports.Ready = Ready;
