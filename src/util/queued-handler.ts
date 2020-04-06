/**
 * This is a special handler manager that consolidates several similar handlers to output to a single handler
 */
export class QueuedHandler {
  /** This stores all handler's input arguments so they can be  */
  private queue: any[] = [];
  /** This is the intended output handler the queued handler is funneling all events to */
  baseHandler: Function;

  constructor(base: Function) {
    this.baseHandler = base;
  }

  /**
   * This generates a handler that will work with this queue and have it's results aggregated rather than broadcast
   * immediately.
   */
  createHandler() {
    return (...args: any[]) => {
      this.queue.push(args);
    };
  }

  /**
   * Provides all of the queued results since last process request.
   */
  process() {
    const out = this.queue;
    this.queue = [];
    return out;
  }
}
