import { BaseAction } from "../Actions/BaseAction.js";

class ActionEventRegistrar {
    private events: Record<string, BaseAction<undefined>>;

    constructor() {
        this.events = {};
    }

    /**
     * Registers an event action listener
     */
    public add(id: string, action: BaseAction<undefined>): void {
        this.events[id] = action;
    }

    /**
     * Removes an event action listener
     */
    public remove(id: string) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.events[id];
    }

    /**
     * Invokes the registered action event listener
     */
    public fire(id: string, data: unknown) {
        if(typeof this.events[id] === "undefined") {
            // The event must have stopped listening
            return;
        }

        this.events[id].handleRegistrarEvent(id, data);
    }

    /**
     * Clears all registered listeners
     */
    public clear() {
        this.events = {};
    }
}

export default new ActionEventRegistrar();
