import { BaseBridge } from "../BaseBridge.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Infer = any;

export abstract class BaseEvent<
    TData = _Infer,
    TCallbackReturn = void,
    TEmitReturn = _Infer,
    TCallbackData = TData,
    TCallbackContext = undefined
> {
    protected callback: (data: TCallbackData, context: TCallbackContext) => TCallbackReturn;

    protected constructor(callback: (data: TCallbackData, context: TCallbackContext) => TCallbackReturn) {
        this.callback = callback;
    }

    /**
     * Invokes the registered callback
     */
    public abstract emit(data: TData, bridge?: BaseBridge): Promise<TEmitReturn>;
}
