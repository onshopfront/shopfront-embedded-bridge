declare abstract class BaseEvent {
    protected callback: Function;
    constructor(callback: Function);
    abstract emit(data: {}): Promise<void>;
}
