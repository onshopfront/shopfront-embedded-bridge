/**
 * A decorator function that enforces static interface implementation for a class at compile time.
 */
export function staticImplements<T>() {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return (constructor: T): void => {};
}
