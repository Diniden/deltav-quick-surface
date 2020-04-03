import {
  ArcInstance,
  ArcLayer,
  ArcScaleType,
  AutoEasingMethod,
  Camera,
  Camera2D,
  CircleInstance,
  CircleLayer,
  EdgeInstance,
  EdgeLayer,
  EdgeType,
  IArcLayerProps,
  ICircleLayerProps,
  IEdgeLayerProps,
  IImageLayerProps,
  ILabelLayerProps,
  ImageInstance,
  ImageLayer,
  InstanceProvider,
  IRingLayerProps,
  ITextAreaLayerProps,
  LabelInstance,
  LabelLayer,
  RectangleLayer,
  ReferenceCamera2D,
  RingInstance,
  RingLayer,
  ScaleMode,
  TextAreaInstance,
  TextAreaLayer,
  View2D,
} from "deltav";
import { QuickSurface } from "./surface/quick-surface";

// Set up Layer type to Resource mapping

QuickSurface.layerResourceMap.set(ImageLayer, { resourceKey: "defaultAtlas" });

QuickSurface.layerResourceMap.set(LabelLayer, { resourceKey: "defaultFont" });

QuickSurface.layerResourceMap.set(TextAreaLayer, {
  resourceKey: "defaultFont",
});

// Set up Instance to Layer compatibility

QuickSurface.instanceLayerMap.set(CircleInstance, {
  type: CircleLayer,
  defaults: () =>
    ({
      animate: {
        center: AutoEasingMethod.easeInOutCubic(500),
        radius: AutoEasingMethod.easeBackOut(500),
      },
      data: new InstanceProvider(),
      key: "",
      streamChanges: { count: 1000 },
      usePoints: true,
    } as ICircleLayerProps<CircleInstance>),
});

QuickSurface.instanceLayerMap.set(EdgeInstance, {
  type: EdgeLayer,
  defaults: (instance) => {
    const edge = instance as EdgeInstance;

    return {
      type:
        edge.control.length > 1
          ? EdgeType.BEZIER2
          : edge.control.length > 0
          ? EdgeType.BEZIER
          : EdgeType.LINE,
      animate: {
        start: AutoEasingMethod.easeInOutCubic(500),
        end: AutoEasingMethod.easeInOutCubic(500),
      },
      data: new InstanceProvider(),
      key: "",
      streamChanges: { count: 1000 },
    } as IEdgeLayerProps<EdgeInstance>;
  },
});

QuickSurface.instanceLayerMap.set(ArcInstance, {
  type: ArcLayer,
  defaults: () =>
    ({
      scaleType: ArcScaleType.NONE,
      animate: {
        angle: AutoEasingMethod.easeOutCubic(500),
        angleOffset: AutoEasingMethod.easeOutCubic(500),
        radius: AutoEasingMethod.easeOutCubic(500),
      },
      data: new InstanceProvider(),
      key: "",
      streamChanges: { count: 1000 },
    } as IArcLayerProps<ArcInstance>),
});

QuickSurface.instanceLayerMap.set(RingInstance, {
  type: RingLayer,
  defaults: () =>
    ({
      data: new InstanceProvider(),
      key: "",
      animate: {
        center: AutoEasingMethod.easeOutCubic(500),
        radius: AutoEasingMethod.easeOutElastic(500),
      },
      streamChanges: { count: 1000 },
    } as IRingLayerProps<RingInstance>),
});

QuickSurface.instanceLayerMap.set(LabelInstance, {
  type: LabelLayer,
  defaults: () =>
    ({
      animate: {
        origin: AutoEasingMethod.easeOutCubic(500),
        color: AutoEasingMethod.easeOutCubic(500),
      },
      data: new InstanceProvider(),
      key: "",
      resourceKey: "",
      scaleMode: ScaleMode.BOUND_MAX,
      truncation: "...",
      streamChanges: { count: 1000 },
    } as ILabelLayerProps<LabelInstance>),
});

QuickSurface.instanceLayerMap.set(TextAreaInstance, {
  type: TextAreaLayer,
  defaults: () =>
    ({
      data: new InstanceProvider(),
      key: "",
      resourceKey: "",
      scaleMode: ScaleMode.BOUND_MAX,
      truncation: "...",
      streamChanges: { count: 1000 },
    } as ITextAreaLayerProps<LabelInstance>),
});

QuickSurface.instanceLayerMap.set(ImageInstance, {
  type: ImageLayer,
  defaults: () =>
    ({
      data: new InstanceProvider(),
      key: "",
      atlas: "",
      rasterizationScale: 1,
      streamChanges: { count: 1000 },
    } as IImageLayerProps<ImageInstance>),
});

// Set up Layer to View compatibility mapping

const view2DDefaults = {
  type: View2D,
  defaults: {
    viewport: { left: 0, right: 0, top: 0, bottom: 0 },
    clearFlags: [],
    key: "",
    camera: new Camera2D(),
  },
};

QuickSurface.layerViewMap.set(CircleLayer, view2DDefaults);
QuickSurface.layerViewMap.set(RingLayer, view2DDefaults);
QuickSurface.layerViewMap.set(ArcLayer, view2DDefaults);
QuickSurface.layerViewMap.set(LabelLayer, view2DDefaults);
QuickSurface.layerViewMap.set(TextAreaLayer, view2DDefaults);
QuickSurface.layerViewMap.set(EdgeLayer, view2DDefaults);
QuickSurface.layerViewMap.set(RectangleLayer, view2DDefaults);
QuickSurface.layerViewMap.set(ImageLayer, view2DDefaults);

// Set up camera to camera reference mapping

QuickSurface.cameraReferenceMap.set(Camera, (camera) => camera);

QuickSurface.cameraReferenceMap.set(
  Camera2D,
  (camera) =>
    new ReferenceCamera2D({
      base: camera as Camera2D,
    })
);
