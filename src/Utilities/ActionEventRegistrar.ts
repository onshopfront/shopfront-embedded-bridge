import { BaseAction } from "../Actions/BaseAction";

class ActionEventRegistrar {
    events: { [id: string]: BaseAction<undefined> };

    constructor() {
        this.events = {};
    }

    public add(id: string, action: BaseAction<undefined>) {
        this.events[id] = action;
    }

    public remove(id: string) {
        delete this.events[id];
    }

    public fire(id: string, data: unknown) {
        if(typeof this.events[id] === "undefined") {
            // The event must have stopped listening
            return;
        }

        this.events[id].handleRegistrarEvent(id, data);
    }

    public clear() {
        this.events = {};
    }
}

export default new ActionEventRegistrar();
