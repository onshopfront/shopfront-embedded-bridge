import {EventEmitter} from "../Common/EventEmitter";
import {Serializable, SerializableStatic, Serialized} from "../Common/Serializable";
import {staticImplements} from "../Utilities/Static";
import ActionEventRegistrar from "../Utilities/ActionEventRegistrar";

interface BaseActionConstructor<T> {
    new(...args: Array<never>): BaseAction<T>;
    new(serialized: Serialized<T>): BaseAction<T>;
}

@staticImplements<SerializableStatic>()
export class BaseAction<T> extends EventEmitter {
    protected target    : string;
    protected events    : Array<{ callback: (...args: Array<unknown>) => void, type: string, id: string }>;
    protected properties: Array<unknown>;

    public static serializedRegistry: {
        [id: string]: BaseActionConstructor<unknown>
    } = {};

    constructor(serialized: Serialized<T>, type: BaseActionConstructor<T>) {
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
            properties: this.serializeProperties(this.properties),
            events    : events,
            type      : this.target,
        };
    }

    protected serializeProperties(properties: Array<unknown>): Array<unknown> {
        const results: Array<unknown> = [];

        // Loop through current layer of properties
        for (let i = 0, l = properties.length; i < l; i++) {
            const property = properties[i];
            if (Array.isArray(property)) {
                // Prepare to recurse through next layer of properties
                results.push(this.serializeProperties(property));
            } else if (property instanceof BaseAction) {
                // Serialize property
                results.push(property.serialize());
            } else {
                // Assume that the property is already serializable
                results.push(property);
            }
        }

        return results;
    }

    public static deserialize<T extends Serializable<T>>(serialized: Serialized<T>): T {
        return new BaseAction.serializedRegistry[serialized.type](serialized) as unknown as T;
    }

    public addEventListener(event: string, callback: (...args: Array<unknown>) => void): void {
        super.addEventListener(event, callback);

        const id = `${Date.now()}-${event}-${Math.random()}`;
        ActionEventRegistrar.add(id, this);

        this.events.push({
            id,
            callback,
            type: event,
        });
    }

    public removeEventListener(event: string, callback: (...args: Array<unknown>) => void): void {
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

    public handleRegistrarEvent(id: string, data: unknown) {
        for(let i = 0, l = this.events.length; i < l; i++) {
            if(this.events[i].id !== id) {
                continue;
            }

            this.events[i].callback(data);

            break;
        }
    }
}
