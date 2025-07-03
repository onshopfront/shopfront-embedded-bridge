/**
 * A property which might be a promise or the promise's wrapped type
 */
export type MaybePromise<P> = P | Promise<P>;

export type ConstructorClass<T> = new(...args: Array<unknown>) => T;

/**
 * A function that may or may not be asynchronous
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: Array<any>) => any;
