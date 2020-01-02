export interface IQuickSurface {
  container: HTMLElement;
}

/**
 * This is an abstraction of the DeltaV surface system to make an even easier route to getting some default Layer's
 * and Instances up and running with less configuration.
 */
export class QuickSurface {
  options: IQuickSurface;

  constructor(options: IQuickSurface) {
    this.options = options;
  }
}
