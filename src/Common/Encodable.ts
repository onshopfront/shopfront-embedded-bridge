export interface Serialized<T> {
    properties: Array<any>,
    events: {
        [event: string]: Array<Function>,
    }
    type: SerializableType<T>,
}

export interface SerializableType<T> {
    new (serialized: Serialized<T>): T;
}

export interface SerializableStatic {
    deserialize<T extends Serializable<T>>(serialized: Serialized<T>): T
}

export interface Serializable<T> {
    serialize(): Serialized<T>
}