import {EventEmitter} from "../Common/EventEmitter";
import {Serializable, SerializableStatic, SerializableType, Serialized} from "../Common/Encodable";
import {staticImplements} from "../Utilities/Static";

@staticImplements<SerializableStatic>()
export class BaseAction<T> extends EventEmitter {
    protected target: SerializableType<T>;

    constructor(serialized: Serialized<T>) {
        if(new.target === BaseAction) {
            throw new TypeError("You cannot construct BaseAction instances directly");
        }

        super();

        this.target = serialized.type;
    }

    public serialize(): Serialized<T> {
        return {
            properties: [],
            events    : {},
            type      : this.target,
        }
    }

    public static deserialize<T extends Serializable<T>>(serialized: Serialized<T>): T {
        return new serialized.type(serialized);
    }
}