import {EventEmitter} from "../Common/EventEmitter";
import {Serializable, SerializableStatic, Serialized} from "../Common/Serializable";
import {staticImplements} from "../Utilities/Static";
import ActionEventRegistrar from "../Utilities/ActionEventRegistrar";

@staticImplements<SerializableStatic>()
export class BaseAction<T> extends EventEmitter {
    //protected target    : SerializableType<T>;
    protected target    : string;
    protected events    : Array<{callback: Function, type: string, id: string}>;
    protected properties: Array<any>;

    public static serializedRegistry: {
        [id: string]: any,
    } = {};

    constructor(serialized: Serialized<T>, type: any) {
        if(new.target === BaseAction) {
            throw new TypeError("You cannot construct BaseAction instances directly");
        }

        super();

        this.target     = serialized.type;
        this.events     = [];
        this.properties = serialized.properties;

        // Ensure that we are registered in the registry
        BaseAction.serializedRegistry[this.target] = type;
    }

    public serialize(): Serialized<T> {
        const events: {[event: string]: Array<string>} = {};
        for(let i = 0, l = this.events.length; i < l; i++) {
            if(typeof events[this.events[i].type] === "undefined") {
                events[this.events[i].type] = [];
            }

            events[this.events[i].type].push(this.events[i].id);
        }

        return {
            properties: this.properties,
            events    : events,
            type      : this.target,
        }
    }

    public static deserialize<T extends Serializable<T>>(serialized: Serialized<T>): T {
        return new BaseAction.serializedRegistry[serialized.type](serialized);
    }

    public addEventListener(event: string, callback: Function): void {
        super.addEventListener(event, callback);

        const id = `${Date.now()}-${event}-${Math.random()}`;
        ActionEventRegistrar.add(id, this);

        this.events.push({
            id,
            callback,
            type: event,
        });
    }

    public removeEventListener(event: string, callback: Function): void {
        super.removeEventListener(event, callback);

        for(let i = 0, l = this.events.length; i < l; i++) {
            if(this.events[i].type !== event) {
                continue;
            }

            if(this.events[i].callback !== callback) {
                continue;
            }

            const id = this.events[i].id;

            ActionEventRegistrar.remove(id);

            this.events = [
                ...this.events.slice(0, i),
                ...this.events.slice(i + 1),
            ];

            break;
        }
    }

    public handleRegistrarEvent(id: string, data: {}) {
        for(let i = 0, l = this.events.length; i < l; i++) {
            if(this.events[i].id !== id) {
                continue;
            }

            this.events[i].callback(data);
            this.removeEventListener(this.events[i].type, this.events[i].callback);

            break;
        }
    }
}