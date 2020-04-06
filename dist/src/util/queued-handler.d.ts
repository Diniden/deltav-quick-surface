export declare class QueuedHandler {
    private queue;
    baseHandler: Function;
    constructor(base: Function);
    createHandler(): (...args: any[]) => void;
    process(): any[];
}
