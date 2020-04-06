import { AbsolutePosition, Camera, EventManager, ILayerConstructionClass, ILayerProps, ILayerRef, Instance, InstanceProvider, IPickInfo, IViewConstructionClass, IViewProps, LayerInitializer, Lookup } from "deltav";
export declare type DeepMap<T, S, D> = {
    [K in keyof T]: T[K] extends S ? D : DeepMap<T[K], S, D>;
};
export declare type QuickView = {
    viewport: AbsolutePosition;
    camera?: Camera;
    manager?: EventManager | EventManager[];
};
export declare type LayerDefaults = {
    type: ILayerConstructionClass<any, any>;
    defaults(instance: Instance): ILayerProps<any>;
};
export declare type ViewDefaults = {
    type: IViewConstructionClass<any>;
    defaults: IViewProps;
};
export declare type InstanceHandler = (info: IPickInfo<Instance>) => void;
export declare function isInstanceHandler(val: Lookup<InstanceHandler> | InstanceHandler): val is InstanceHandler;
export declare function isQuickView(val: Lookup<QuickView> | QuickView): val is QuickView;
export declare function isLayerInitializer(val?: any): val is LayerInitializer;
export declare function isLayerRef(val?: Lookup<ILayerRef | undefined> | ILayerRef): val is ILayerRef;
export declare function isInstanceType(val?: Instance[] | Lookup<Instance[]>): val is Instance[];
export declare function isInstanceProvider<T extends Instance>(val: InstanceProvider<T> | Lookup<InstanceProvider<T>>): val is InstanceProvider<T>;
