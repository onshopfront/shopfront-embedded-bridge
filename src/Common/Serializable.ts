
export interface Serialized<T> {
    properties: Array<unknown>;
    events: Record<string, Array<string>>;
    // type: SerializableType<T>,
    type: string;
}

export type SerializableType<T> = new (serialized: Serialized<T>) => T;

export interface SerializableStatic {
    /**
     * Deserializes the serialized data
     * @param serialized
     */
    deserialize<T extends Serializable<T>>(serialized: Serialized<T>): T;
}

export interface Serializable<T> {
    /**
     * Serializes the data
     */
    serialize(): Serialized<T>;
}
