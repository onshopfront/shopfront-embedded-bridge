/**
 * A property which might be a promise or the promise's wrapped type
 */
export type MaybePromise<P> = P | Promise<P>;

export interface ConstructorClass<T> {
    new(...args: Array<unknown>): T
}
