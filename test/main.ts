import {
  BasicCamera2DController,
  Bounds,
  getAbsolutePositionBounds,
  Instance,
  InstanceProvider,
  Lookup,
} from "deltav";
import {
  InstanceHandler,
  IQuickSurfaceMouseHandlers,
  IQuickSurfaceTouchHandlers,
  QuickSurface,
  QuickView,
} from "../src";
import { ArcKPI } from "./views/arc-kpi";
import { Base } from "./views/base";
import { Circles } from "./views/circles";
import { InheritedDataTypes } from "./views/inherited-data-types";
import { makeViews } from "./views/make-view";
import { RingKPI } from "./views/ring-kpi";

const DEMOS = [Circles, ArcKPI, RingKPI, InheritedDataTypes];

function ready(callback: Function) {
  if (typeof document === "undefined") {
    throw new Error("document-ready only runs in the browser");
  }

  const state = document.readyState;

  if (state === "complete" || state === "interactive") {
    return setTimeout(callback, 0);
  }

  document.addEventListener("DOMContentLoaded", function onLoad() {
    callback();
  });

  return -1;
}

async function start() {
  const container = document.getElementById("main");
  if (!container) return;
  const box = container.getBoundingClientRect();

  const screenBounds = new Bounds({
    x: 0,
    y: 0,
    width: box.width,
    height: box.height,
  });

  // Create enough views to contain all demos generated
  const getView = makeViews(DEMOS.length);
  // Create a list of demos to work with and give each demo it's own view to render within
  const demos: Base[] = DEMOS.map((demoFn) => new demoFn(getView()));
  // Set up our data and view objects that will configure the QuickSurface
  const data: Lookup<Instance[]> = {};
  const views: Lookup<QuickView> = {};
  const handlers: IQuickSurfaceMouseHandlers & IQuickSurfaceTouchHandlers = {};

  // Get the initial data from each demo and wire up each demo to it's own view
  demos.forEach((demo, i) => {
    const demoName = `demo${i}`;
    const view = demo.view;
    // Get the dimensions of the view area.
    const bounds = getAbsolutePositionBounds(view.viewport, screenBounds, 1);
    // Set the bounds of the view area relative to the elements using the view
    bounds.x = 0;
    bounds.y = 0;

    // Get the data from the demo
    const demoData = demo.getData(bounds);
    views[demoName] = view;
    data[demoName] = demoData;
    (view.manager as BasicCamera2DController).startViews = [
      `${demoName}.${demoName}`,
    ];

    // Get the handlers from the demo
    const demoHandlers = demo.getHandlers();

    // We aggregate the handlers beneath the correct handler name and under the proper demo identifier
    for (const key in demoHandlers) {
      const handlerName = key as
        | keyof IQuickSurfaceTouchHandlers
        | keyof IQuickSurfaceMouseHandlers;
      const handlerGroup: Lookup<InstanceHandler> = handlers[handlerName] || {};
      handlers[handlerName] = handlerGroup;
      const demoHandlerGroup = demoHandlers[handlerName];

      if (demoHandlerGroup) {
        handlerGroup[demoName] = demoHandlerGroup;
      }
    }
  });

  // Generate the surface
  const surface = new QuickSurface({
    container,
    data,
    views,
    ...handlers,
  });

  await surface.ready;

  // Now start each demo once all of the initial data is loaded in
  demos.forEach((demo, i) =>
    demo.start(surface.data[`demo${i}`] as Lookup<InstanceProvider<Instance>>)
  );
}

ready(start);
