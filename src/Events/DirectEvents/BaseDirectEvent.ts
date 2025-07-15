import { DirectShopfrontCallbacks, DirectShopfrontEvent, DirectShopfrontEventData } from "../../ApplicationEvents.js";

export abstract class BaseDirectEvent<
    TEvent extends DirectShopfrontEvent,
    TData = DirectShopfrontEventData[TEvent],
    TCallback = DirectShopfrontCallbacks[TEvent],
> {
    protected callback: TCallback;

    protected constructor(callback: TCallback) {
        this.callback = callback;
    }

    /**
     * Ensures the event data is formatted correctly
     */
    protected abstract isEventData(event: unknown): event is TData;

    /**
     * Invokes the registered callback
     */
    public abstract emit(event: unknown): Promise<void>;
}
