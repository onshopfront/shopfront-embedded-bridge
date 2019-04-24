export declare class EventEmitter {
    protected supportedEvents: Array<string>;
    private listeners;
    addEventListener(event: string, callback: Function): void;
    removeEventListener(event: string, callback: Function): void;
    protected emit(event: string, ...args: any[]): Promise<Array<any>>;
}
