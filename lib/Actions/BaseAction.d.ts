import { EventEmitter } from "../Common/EventEmitter";
import { Serializable, SerializableType, Serialized } from "../Common/Serializable";
export declare class BaseAction<T> extends EventEmitter {
    protected target: SerializableType<T>;
    protected events: Array<{
        callback: Function;
        type: string;
        id: string;
    }>;
    protected properties: Array<any>;
    constructor(serialized: Serialized<T>);
    serialize(): Serialized<T>;
    static deserialize<T extends Serializable<T>>(serialized: Serialized<T>): T;
    addEventListener(event: string, callback: Function): void;
    removeEventListener(event: string, callback: Function): void;
    handleRegistrarEvent(id: string, data: {}): void;
}
