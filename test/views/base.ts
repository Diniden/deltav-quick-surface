import { Bounds, Instance, InstanceProvider, Lookup } from "deltav";
import { QuickView } from "../../src";

export class Base {
  view: QuickView;

  constructor(view: QuickView) {
    this.view = view;
  }

  getData(_bounds: Bounds<any>): Lookup<Instance[]> {
    return {};
  }

  async start(_providers: Lookup<InstanceProvider<Instance>>) {
    return;
  }
}
