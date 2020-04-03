import {
  BaseResourceOptions,
  BasicCamera2DController,
  BasicSurface,
  BasicSurfaceSceneOptions,
  Camera,
  Camera2D,
  Color,
  createAtlas,
  createFont,
  createLayer,
  createView,
  EventManager,
  FontMapGlyphType,
  IFontResourceOptions,
  ILayerConstructionClass,
  ILayerProps,
  ILayerRef,
  IMousePickInfo,
  Instance,
  InstanceProvider,
  isDefined,
  ISurfaceOptions,
  ITouchPickInfo,
  IViewProps,
  Layer,
  LayerInitializer,
  Lookup,
  preloadNumber,
  PromiseResolver,
  ReferenceCamera2D,
  TextureSize,
  ViewInitializer,
  WebGLStat,
} from "deltav";
import {
  DeepMap,
  isInstanceType,
  isLayerInitializer,
  isLayerRef,
  isQuickView,
  LayerDefaults,
  QuickView,
  ViewDefaults,
} from "../types";
import { deleteProp } from "../util/delete-prop";
import { getProp } from "../util/get-prop";
import { lookupValues } from "../util/lookup-values";
import { loopInheritance } from "../util/loop-inheritance";
import { mapLookupValues } from "../util/map-lookup-values";
import { setProp } from "../util/set-prop";

/**
 * Makes a quickview object and makes it identifiablewithin lookups.
 */
export function view(options: QuickView): QuickView {
  return options;
}

/**
 * These are the options needed to get a quick surface rolling. At minimum the quick surface will only need a container
 * and some data. The configuration goes up from there.
 */
export interface IQuickSurface<T extends Lookup<Instance[]>> {
  /** Sets the background color of the surface. Default is transparent. */
  background?: Color;
  /** The container to render the surface within */
  container: HTMLElement;
  /** The instances to render in the surface. */
  data?: T;
  /**
   * If this is provided, this will override any font resources auto calculated for ALL of the items injected into the
   * QuickSurface. Use QuickSurface.layerResourceMap if you want to manipulate the surface to use multiple font styles.
   */
  font?: IFontResourceOptions;
  /**
   * Rendering options that are passed to the Surface directly. Some sane defaults are selected if this is not specified
   */
  rendererOptions?: ISurfaceOptions["rendererOptions"];
  /**
   * If desired: this allows you to group your data into various views on the canvas. Simply use a key identifier that
   * is the same in your data to lump all data elements into the same view box. You then specify the view box where
   * the data should be rendered.
   *
   * eg: if you have data structured like:
   *
   * data = { test: { test1: [...data], test2: [...data] }, foo: [...data]}
   *
   * you can render all elements under test in it's own viewbox by:
   *
   * views = { test: { viewport: { left: 0, right: '50%', bottom: '50%', top: 0 }} }
   *
   * A view can also specify a custom camera and a custom event manager if desired. Otherwise, a shared camera and a
   * BasicEventManager2D is used by default.
   */
  views?: Lookup<QuickView>;
  /**
   * This callback executes when no webgl context is available. This can be used to trigger a response to show an
   * alternative graphic for the
   */
  onNoWebGL?(): void;

  /**
   * Specify mouse events for groups of instances.
   */
  onMouseOver?: Lookup<(info: IMousePickInfo<Instance>) => void>;
  onMouseOut?: Lookup<(info: IMousePickInfo<Instance>) => void>;
  onMouseClick?: Lookup<(info: IMousePickInfo<Instance>) => void>;
  onMouseDown?: Lookup<(info: IMousePickInfo<Instance>) => void>;
  onMouseUp?: Lookup<(info: IMousePickInfo<Instance>) => void>;
  onMouseUpOutside?: Lookup<(info: IMousePickInfo<Instance>) => void>;
  onMouseMove?: Lookup<(info: IMousePickInfo<Instance>) => void>;

  /**
   * Specify touch events for groups of instances
   */
  onTap?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchAllEnd?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchAllOut?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchDown?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchUp?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchUpOutside?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchOver?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchMove?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
  onTouchOut?: Lookup<(info: ITouchPickInfo<Instance>) => void>;
}

/**
 * The internal configuration of the Quick Surface options as is stored on the Quick Surface itself.
 */
interface IQuickSurfaceInternal<T extends Lookup<Instance[]>>
  extends IQuickSurface<T> {
  /** The background of the surface */
  background: Color;
}

/**
 * This is an abstraction of the DeltaV surface system to make an even easier route to getting some default Layer's
 * and Instances up and running with less configuration. This is not intended to fully replace BasicSurface or Surface
 * as it is NOT a pipeline control.
 *
 * This Surface essentially lets you focus on top level instances rather than worry about any process necessary to
 * render the instances.
 */
export class QuickSurface<TLookup extends Lookup<Instance[]>> {
  /**
   * DANGER: Advanced use only. A list of the resources that will be available. There will be at least a font and image
   * resource available. The property keys to the resource is the key of the resource.
   */
  static defaultResources: Lookup<BaseResourceOptions> = {
    defaultAtlas: createAtlas({
      height: Math.min(WebGLStat.MAX_TEXTURE_SIZE, TextureSize._4096),
      width: Math.min(WebGLStat.MAX_TEXTURE_SIZE, TextureSize._4096),
    }),
    defaultFont: createFont({
      fontSource: {
        errorGlyph: "",
        family: "Verdana",
        size: 64,
        weight: 400,
        localKerningCache: false,
        type: FontMapGlyphType.BITMAP,
        preload: preloadNumber(),
      },
      dynamic: true,
      fontMapSize: [
        Math.min(WebGLStat.MAX_TEXTURE_SIZE, TextureSize._4096),
        Math.min(WebGLStat.MAX_TEXTURE_SIZE, TextureSize._4096),
      ],
    }),
  };
  /**
   * DANGER: Advanced use only. Associate a layer type to a resource it should be using as well as provide the prop key
   * to apply the resource name to.
   */
  static layerResourceMap = new Map<
    ILayerConstructionClass<any, any>,
    { [key: string]: string }
  >();
  /**
   * DANGER: Advanced use only. This is merely a way to map instance classes to the layer type needed to render the
   * instance.
   */
  static instanceLayerMap = new Map<any, LayerDefaults>();
  /**
   * DANGER: Advanced use only. This is merely a way to map instance classes to the view type needed to render the
   * instance's expected layer type correctly.
   */
  static layerViewMap = new Map<
    ILayerConstructionClass<any, any>,
    ViewDefaults
  >();
  /**
   * DANGER: Advanced use only. This is merely a way to map Camera class types to a valid reference camera type so the
   * camera can be properly shared amongst all views if it gets used multiple times.
   */
  static cameraReferenceMap = new Map<Function, (cam: Camera) => Camera>();

  /** This stores the raw Surface that we are abstracting with this class */
  base: BasicSurface<this["data"], any, any, any>;
  /** This is the DOM canvas we are actually rendering to */
  context: HTMLCanvasElement;
  /** This is the mapped data object produced from the input data. This is a mapping of all providers. */
  data: DeepMap<TLookup, Instance[], InstanceProvider<Instance>>;
  /** This is all of the refs generated for the layers that are created allowing for deeper introspection. */
  refs: DeepMap<TLookup, Instance[], ILayerRef>;

  /** These are the options that built this container */
  private options: IQuickSurfaceInternal<TLookup>;
  /** The default camera used for a view if none is specific */
  private defaultCamera = new Camera2D();

  /** A simple default controller for managing the default camera of the view */
  private defaultManager = new BasicCamera2DController({
    camera: this.defaultCamera,
    ignoreCoverViews: true,
    startView: ["default-view.default-view"],
  });

  /** These are the layers we produce to match the data format input */
  private layers: DeepMap<
    TLookup,
    Instance | Instance[],
    ReturnType<typeof createLayer>
  >;

  /** These are the event managers discovered while building the surface */
  private eventManagers: Lookup<EventManager> = {};

  /** These are the scenes generated for the Basic Surface as discovered by the input data */
  private scenes: Lookup<BasicSurfaceSceneOptions>;

  /** A promise that can be used to wait for readiness of the surface. */
  get ready() {
    return this._ready.promise;
  }
  private _ready = new PromiseResolver<void>();

  /**
   * Constructor of the surface. Takes in the Quick Surface options to configure the instance.
   */
  constructor(options: IQuickSurface<TLookup>) {
    // Hang onto the options from the input so we can keep necessary settings.
    this.options = Object.assign(
      {
        background: [0, 0, 0, 0],
      },
      options
    );
    // Start up the view with all of the new options.
    this.init();
  }

  /**
   * Generates the layers that will be needed to render the data.
   */
  private createLayerInitializer<T extends Instance>(
    key: string[],
    provider: InstanceProvider<T>,
    instances: Instance[]
  ) {
    // We retrieve a single instance associated with the layer so we can pick out which layer is mapped to the
    // instance type.
    if (isInstanceType(instances)) {
      const instance = instances[0];
      if (!instance) return;
      let layerClass: ILayerConstructionClass<any, any> | undefined;
      let props: ILayerProps<any> | undefined;

      // Examine our instances inheritance chain to find a mapped layer type
      loopInheritance(instance, (baseClass) => {
        const base = QuickSurface.instanceLayerMap.get(baseClass);

        if (base) {
          layerClass = base.type;
          props = base.defaults(instance);
          return true;
        }

        return;
      });

      // If we found a valid mapped Layer for the instance type, then we can create the layer and apply the provider
      // generated for the layer.
      if (layerClass && props) {
        // Check for a resource specification for the layer type
        let resource = QuickSurface.layerResourceMap.get(layerClass);

        // If no resource configuration for the exact layer is found, look up the inheritance chain of the layer for
        // base layer registrations.
        if (!resource) {
          loopInheritance(layerClass, (baseClass) => {
            resource = QuickSurface.layerResourceMap.get(baseClass as any);
          });
        }

        // Make a ref to apply to the layer so we can properly analyze deeper information the layer may provide.
        const ref = Layer.createRef();

        const layer = createLayer(layerClass, {
          // Set the default properties of the layer as specified from the configuration.
          ...props,
          // Ensure the key of the layer is the layer's property key chain.
          key: key.join("."),
          // Layer will be tied to the data provider specified
          data: provider,
          // Apply the generated ref for the layer for later inspection
          ref,
          // The resource specification should apply to the layer if it is present
          ...resource,
        });

        // Make our layer object have a similar property key chain as the key chain found for the data.
        setProp(this.layers, layer, key);
        // Make our refs mirror the layers property generated
        setProp(this.refs, ref, key);

        return layer;
      } else {
        console.warn(
          "Could not find a suitable layer for the provided instances."
        );
      }
    }

    return null;
  }

  /**
   * This parses the data input and establishes the provider structure for the surface
   */
  private createProvidersAndLayers() {
    // Get the initial input data for the surface to render and provide providers for.
    const data = this.options.data;
    if (!data) return;

    // We delete the reference to the data internally so we don't hold onto any data structures that organize the data
    // as they will no longer be needed for this context and are a waste of memory once they are within our providers.
    delete this.options.data;
    // Make sure we have an initial empty layerobject to work with
    this.layers = {} as any;
    this.refs = {} as any;

    const providers = mapLookupValues(
      "providers",
      isInstanceType,
      data,
      (key, instances: Instance[]) => {
        // Make sure we handle any input as a list
        if (!Array.isArray(instances)) instances = [instances];
        // Make a provider for this source
        const provider = new InstanceProvider();

        // Add all of the instances found for the key detected
        for (let i = 0, iMax = instances.length; i < iMax; ++i) {
          const instance = instances[i];
          provider.add(instance);
        }

        // Now that a provider is created we must generate a layer for the key as well
        this.createLayerInitializer(key, provider, instances);

        return provider;
      }
    );

    this.data = providers;
  }

  /**
   * This takes the information in the views and groups the data providers and layers into the scenes they will be a
   * part of.
   */
  private createScenesAndViews() {
    const views = this.options.views;
    const eventManagers: EventManager[] = [this.defaultManager];
    let viewsAndLayers: ReturnType<
      QuickSurface<TLookup>["createViewInitializers"]
    > = [];

    // Make the default view under which all layers NOT grouped under a declared view will be placed.
    const defaultView: QuickView = {
      viewport: { left: 0, right: 0, bottom: 0, top: 0 },
      camera: this.defaultCamera,
      manager: this.defaultManager,
    };
    // Make a deep copy of the layers configuration for analyzing.
    const layers: Lookup<LayerInitializer | undefined> = {} as any;
    mapLookupValues("views", isLayerInitializer, this.layers, (keys, value) => {
      setProp(layers, value, keys);
    });

    // If we have views, we group up layers beneath the indicated view
    if (views) {
      // Storage for the layer items to be deleted as layers are grouped under a view
      const toRemove: string[][] = [];

      // Look for views available. If a view is present, we gather all of the Layers beneath the reference key.
      mapLookupValues("views", isQuickView, views, (keys, value) => {
        // Get the lookup for the layers that matches the view's key
        const subLayerLookup = getProp(layers, keys);
        if (!subLayerLookup) return;

        // If the key points to a single layer initializer, then we have a view for a single layer
        if (isLayerInitializer(subLayerLookup)) {
          // Generate our view initializer for this view
          const viewInit = this.createViewInitializers(
            keys,
            [subLayerLookup],
            value
          );
          // We need to gather all of the found views and layers
          viewsAndLayers = viewsAndLayers.concat(viewInit);
        } else {
          // Retrieve all layers beneath the given key
          const layersForView = lookupValues(
            isLayerInitializer,
            subLayerLookup
          );

          // Generate our view initializer for this view
          const viewInits = this.createViewInitializers(
            keys,
            layersForView,
            value
          );
          // We need to gather all of the found views and layers
          viewsAndLayers = viewsAndLayers.concat(viewInits);
        }

        // Now remove those keys from the layers object
        toRemove.push(keys);

        // Now let's add the managers the view's specify
        // NOTE: We will NOT need to add cameras to the basic surface. Cameras at the Surface level are only added to
        // the view, the BasicSurface needs them for convenience patterns.
        if (value.manager) {
          if (Array.isArray(value.manager)) {
            eventManagers.push(...value.manager);
          } else {
            eventManagers.push(value.manager);
          }
        }
      });

      // Perform the removals now that we're outside iterating the object
      toRemove.forEach((keys) => deleteProp(layers, keys));
    }

    // At this point, all remaining layers will be grouped underneath the main default view
    const layersForDefaultView = lookupValues(isLayerInitializer, layers);

    // Generate our view initializer for this view
    const viewInits = this.createViewInitializers(
      ["default-view"],
      layersForDefaultView,
      defaultView
    );
    // We need to gather all of the found views and layers and play them at the beginning of our list
    viewsAndLayers = viewInits.concat(viewsAndLayers);

    // This is the scenes that will be set to the surface
    const scenes: Lookup<BasicSurfaceSceneOptions> = {};

    // Now loop through all of the generated views and initializers and generate the scenes we wil use in our
    // basic surface. There will be a scene per view to simplify complexity and since the configuration for the views
    // does not involve multi-view per group of layers.
    for (let i = 0, iMax = viewsAndLayers.length; i < iMax; ++i) {
      const [view, layers] = viewsAndLayers[i];

      const scene: BasicSurfaceSceneOptions = {
        layers: layers,
        views: {
          [view.key]: view,
        },
      };

      setProp(scenes, scene, view.key.split("."));
    }

    // Apply the generated scenes
    this.scenes = scenes;
    // Apply the discovered event managers
    eventManagers.forEach((manager, i) => {
      this.eventManagers[i] = manager;
    });
  }

  /**
   * Generates view initializers based on the layer initializers passed in. Each layer initializer has it's own type
   * of required view type to render the layer appropriately.
   */
  private createViewInitializers(
    keys: string[],
    layer: LayerInitializer[],
    view: QuickView
  ): [ViewInitializer<IViewProps>, LayerInitializer[]][] {
    const organizeByClass = new Map<ViewDefaults, LayerInitializer[]>();
    const errored = new Set();

    // First take all of the initializers and organize them by layer class. Each class type will have it's own potential ViewClass type
    for (let i = 0, iMax = layer.length; i < iMax; ++i) {
      const layerInit = layer[i];
      const layerClass = layerInit.init[0];
      const viewDefaults = QuickSurface.layerViewMap.get(layerClass);

      // We MUST have a mapped View object in order to be able to render the layer type.
      if (!viewDefaults) {
        // Only display the error once for each layer class
        if (errored.has(layerClass)) {
          console.warn(
            `Quick Surface could not determine a View type appropriate for the inferred layer type.`,
            "All elements that require this layer type will not be rendered.",
            "Layer:",
            layerClass
          );
          errored.add(layerClass);
        }
        continue;
      }

      // Now organize each layer to the view it should be a part of
      let layers = organizeByClass.get(viewDefaults);

      if (!layers) {
        layers = [];
        organizeByClass.set(viewDefaults, layers);
      }

      layers.push(layerInit);
    }

    // Now that each layer is appropriately organized by the views it will be associated with, we can generate the
    // needed view initializers
    const out: [ViewInitializer<IViewProps>, LayerInitializer[]][] = [];
    // This is an identifier to ensure our view's have unique keys
    let viewId = -1;

    organizeByClass.forEach((layers, viewDefaults) => {
      let key = keys;

      if (organizeByClass.size > 1) {
        key = key.concat(`${++viewId}`);
      }

      const viewInit = createView(viewDefaults.type, {
        ...viewDefaults.defaults,
        key: key.join("."),
        camera:
          view.camera ||
          new ReferenceCamera2D({
            base: this.defaultCamera,
          }),
        viewport: view.viewport,
      });

      out.push([viewInit, layers]);
    });

    return out;
  }

  /**
   * Frees all GPU memory and resources used by this Surface.
   */
  destroy = () => {
    // Make sure the base surface is destroyed and all WebGL resources are freed.
    if (this.base) {
      this.base.destroy();
      delete this.base;
    }
  };

  /**
   * Tells the surface to resize to the container if it's not fitted currently.
   */
  fitContainer(preventRedraw?: boolean) {
    if (this.base) {
      this.base.fitContainer(preventRedraw);
    }
  }

  /**
   * Initializes all elements for the surface
   */
  async init() {
    // If the base is established, then this is initialized
    if (this.base) return;

    // Analyze the input data and generate the providers to model the input.
    this.createProvidersAndLayers();
    // Generate the scenes
    this.createScenesAndViews();
    // We make our default font mimic the inherited font of the container to further simplify configuration.
    const style = getComputedStyle(this.options.container);
    const defaultFont = QuickSurface.defaultResources
      .defaultFont as IFontResourceOptions;
    defaultFont.fontSource.family = style.fontFamily;

    // Create the surface to work with
    this.base = new BasicSurface({
      container: this.options.container,
      providers: this.data,
      resources: QuickSurface.defaultResources,
      cameras: {},
      handlesWheelEvents: true,
      rendererOptions: {
        alpha: false,
        antialias: true,
        ...this.options.rendererOptions,
      },
      eventManagers: () => this.eventManagers,
      scenes: () => this.scenes,
      onNoWebGL: () => this.options.onNoWebGL?.(),
    });

    // Wait for the base to be prepared
    await this.base.ready;
    // Wait on all of our refs for completion of initial adding
    const refs = lookupValues(isLayerRef, this.refs);
    const completes = refs
      .map((ref) => ref.easing?.complete())
      .filter(isDefined);
    await Promise.all(completes);

    this._ready.resolve();
  }
}
