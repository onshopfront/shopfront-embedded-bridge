abstract class BaseEvent {
    protected callback: Function;

    constructor(callback: Function) {
        this.callback = callback;
    }

    public abstract async emit(data: {}): Promise<void>;
}