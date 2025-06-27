/**
 * A property which might be a promise or the promise's wrapped type
 */
export type MaybePromise<P> = P | Promise<P>;

export type ConstructorClass<T> = new(...args: Array<unknown>) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type _Infer = any;
