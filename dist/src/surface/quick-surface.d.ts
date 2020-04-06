import { BaseResourceOptions, BasicSurface, Camera, Color, IFontResourceOptions, ILayerConstructionClass, ILayerRef, IMousePickInfo, Instance, InstanceProvider, ISurfaceOptions, ITouchPickInfo, Lookup } from "deltav";
import { DeepMap, LayerDefaults, QuickView, ViewDefaults } from "../types";
export declare function view(options: QuickView): QuickView;
export interface IQuickSurfaceMouseHandlers {
    onMouseOver?: Lookup<(info: IMousePickInfo<Instance>) => void>;
    onMouseOut?: Lookup<(info: IMousePickInfo<Instance>) => void>;
    onMouseClick?: Lookup<(info: IMousePickInfo<Instance>) => void>;
    onMouseDown?: Lookup<(info: IMousePickInfo<Instance>) => void>;
    onMouseUp?: Lookup<(info: IMousePickInfo<Instance>) => void>;
    onMouseUpOutside?: Lookup<(info: IMousePickInfo<Instance>) => void>;
    onMouseMove?: Lookup<(info: IMousePickInfo<Instance>) => void>;
}
export interface IQuickSurfaceTouchHandlers {
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
export interface IQuickSurface<T extends Lookup<Instance[]>> extends IQuickSurfaceMouseHandlers, IQuickSurfaceTouchHandlers {
    background?: Color;
    container: HTMLElement;
    data?: T;
    font?: IFontResourceOptions;
    rendererOptions?: ISurfaceOptions["rendererOptions"];
    views?: Lookup<QuickView>;
    onNoWebGL?(): void;
}
export declare class QuickSurface<TLookup extends Lookup<Instance[]>> {
    static defaultResources: Lookup<BaseResourceOptions>;
    static layerResourceMap: Map<ILayerConstructionClass<any, any>, {
        [key: string]: string;
    }>;
    static instanceLayerMap: Map<any, LayerDefaults>;
    static layerViewMap: Map<ILayerConstructionClass<any, any>, ViewDefaults>;
    static cameraReferenceMap: Map<Function, (cam: Camera) => Camera>;
    base: BasicSurface<this["data"], any, any, any>;
    context: HTMLCanvasElement;
    data: DeepMap<TLookup, Instance[], InstanceProvider<Instance>>;
    refs: DeepMap<TLookup, Instance[], ILayerRef>;
    private defaultCamera;
    private defaultManager;
    private eventManagers;
    private eventProcessingLoopId;
    private layers;
    private mouseQueuedHandlers;
    private options;
    private scenes;
    private touchQueuedHandlers;
    get ready(): Promise<void>;
    private _ready;
    constructor(options: IQuickSurface<TLookup>);
    private createEventHandlerQueues;
    private createLayerInitializer;
    private createProvidersAndLayers;
    private createScenesAndViews;
    private createViewInitializers;
    destroy: () => void;
    fitContainer(preventRedraw?: boolean): void;
    handleEvents: () => void;
    init(): Promise<void>;
}
