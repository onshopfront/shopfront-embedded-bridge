// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseEvent<TData = any, TCallbackReturn = void, TEmitReturn = any, TCallbackData = TData, TCallbackContext = undefined> {
    protected callback: (data: TCallbackData, context: TCallbackContext) => TCallbackReturn;

    protected constructor(callback: (data: TCallbackData, context: TCallbackContext) => TCallbackReturn) {
        this.callback = callback;
    }

    public abstract emit(data: TData): Promise<TEmitReturn>;
}
