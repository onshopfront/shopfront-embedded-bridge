import { BaseAction } from "../Actions/BaseAction";

class ActionEventRegistrar {
    events: { [id: string]: BaseAction<any> };

    constructor() {
        this.events = {};
    }

    public add(id: string, action: BaseAction<any>) {
        this.events[id] = action;
    }

    public remove(id: string) {
        delete this.events[id];
    }

    public fire(id: string, data: {}) {
        if(typeof this.events[id] === "undefined") {
            // The event must have stopped listening
            return;
        }

        this.events[id].handleRegistrarEvent(id, data);
    }
}

export default new ActionEventRegistrar();