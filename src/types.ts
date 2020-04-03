import {
  AbsolutePosition,
  Camera,
  EventManager,
  ILayerConstructionClass,
  ILayerProps,
  ILayerRef,
  Instance,
  InstanceProvider,
  IViewConstructionClass,
  IViewProps,
  LayerInitializer,
  Lookup,
} from "deltav";

export type DeepMap<T, S, D> = {
  [K in keyof T]: T[K] extends S ? D : DeepMap<T[K], S, D>;
};

/**
 * A simple and quick definition of a view.
 */
export type QuickView = {
  viewport: AbsolutePosition;
  camera?: Camera;
  manager?: EventManager | EventManager[];
};

/**
 * A setting defining a type of layer class along with defaults to apply to that layer class upon construction.
 */
export type LayerDefaults = {
  type: ILayerConstructionClass<any, any>;
  defaults(instance: Instance): ILayerProps<any>;
};

/**
 * A setting defining a type of view class along with defaults to apply to that view class upon construction.
 */
export type ViewDefaults = {
  type: IViewConstructionClass<any>;
  defaults: IViewProps;
};

/**
 * Typeguard for QuickView options
 */
export function isQuickView(
  val: Lookup<QuickView> | QuickView
): val is QuickView {
  return Boolean(val && val.viewport);
}

/**
 * Typeguard for deltav LayerInitializers
 */
export function isLayerInitializer(
  val?: Lookup<LayerInitializer | undefined> | LayerInitializer
): val is LayerInitializer {
  return val !== void 0 && Boolean(val.key !== void 0 && val.init);
}

/**
 * Typeguard for deltav ILayerRefs
 */
export function isLayerRef(
  val?: Lookup<ILayerRef | undefined> | ILayerRef
): val is ILayerRef {
  return val !== void 0 && val.easing !== void 0;
}

/**
 * Typeguard for determining lookup value being a single or list of Instance
 */
export function isInstanceType(
  val?: Instance[] | Lookup<Instance[]>
): val is Instance[] {
  return Boolean(val && Array.isArray(val));
}

/**
 * Typeguard for filtering InstanceProvider look ups to determine if the element is a lookup or a provider
 */
export function isInstanceProvider<T extends Instance>(
  val: InstanceProvider<T> | Lookup<InstanceProvider<T>>
): val is InstanceProvider<T> {
  return val instanceof InstanceProvider;
}
