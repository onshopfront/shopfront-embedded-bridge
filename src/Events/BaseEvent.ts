import { Bridge } from "../Bridge.js";
import { _Infer } from "../Utilities/MiscTypes.js";

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
     * @param data
     * @param bridge
     */
    public abstract emit(data: TData, bridge?: Bridge): Promise<TEmitReturn>;
}
