export class EventEmitter {
    protected supportedEvents: Array<string> = [];
    private listeners: {
        [event: string]: Array<Function>
    } = {};

    public addEventListener(event: string, callback: Function): void {
        if(!this.supportedEvents.includes(event)) {
            throw new TypeError(`${event} is not a supported event`);
        }

        if(typeof this.listeners[event] === "undefined") {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    public removeEventListener(event: string, callback: Function): void {
        if(!this.supportedEvents.includes(event)) {
            throw new TypeError(`${event} is not a supported event`);
        }

        if(typeof this.listeners[event] === "undefined") {
            return;
        }

        const index = this.listeners[event].indexOf(callback);

        if(index === -1) {
            return;
        }

        this.listeners[event] = [
            ...this.listeners[event].slice(0, index),
            ...this.listeners[event].slice(index + 1),
        ];
    }

    protected async emit(event: string, ...args: any[]): Promise<Array<any>> {
        if(typeof this.listeners[event] === "undefined") {
            return Promise.resolve([]);
        }

        const events: Array<Promise<any>> = [];

        for(let i = 0, l = this.listeners[event].length; i < l; i++) {
            events.push(this.listeners[event][i](...args));
        }

        return Promise.all(events);
    }
}