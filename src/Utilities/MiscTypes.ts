/**
 * A property which might be a promise or the promise's wrapped type
 */
export type MaybePromise<P> = P | Promise<P>;
