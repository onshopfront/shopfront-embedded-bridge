export abstract class BaseEvent {
    protected callback: Function;

    protected constructor(callback: Function) {
        this.callback = callback;
    }

    public abstract async emit(data: object): Promise<any>;
}