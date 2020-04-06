import {
  add2,
  AnchorType,
  Bounds,
  Color,
  EasingUtil,
  GlyphLayer,
  LabelInstance,
  normalize2,
  onAnimationLoop,
  RingInstance,
  RingLayer,
  scale2,
  Vec2,
} from "deltav";
import { rand } from "../util/rand";
import { Base } from "./base";

export class RingKPI extends Base {
  labels: LabelInstance[] = [];
  rings: RingInstance[];
  label: LabelInstance;
  mid: Vec2;

  getData(bounds: Bounds<any>): ReturnType<Base["getData"]> {
    this.rings = new Array(5).fill(0).map(() => {
      const color: Color = [rand(0.5, 1), rand(0.5, 1), rand(0.5, 1), 1];

      this.labels.push(
        new LabelInstance({
          color: [1, 1, 1, 0],
          origin: bounds.mid,
          text: `${Math.round(Math.random() * 100)}`,
          fontSize: 20,
          anchor: {
            type: AnchorType.Middle,
            padding: 0,
          },
        })
      );

      return new RingInstance({
        center: bounds.mid,
        color,
        radius: 50,
        thickness: 4,
      });
    });

    this.mid = bounds.mid;

    this.label = new LabelInstance({
      color: [1, 1, 1, 1],
      origin: this.mid,
      text: "0",
      fontSize: 20,
      anchor: {
        type: AnchorType.Middle,
        padding: 0,
      },
    });

    return {
      rings: this.rings,
      label: [this.label],
      labels: this.labels,
    };
  }

  getHandlers(): ReturnType<Base["getHandlers"]> {
    return {
      onMouseOver: {
        rings: (info) => {
          info.instances.forEach((ring: RingInstance) => {
            ring.thickness = 10;
          });
        },
      },
      onMouseOut: {
        rings: (info) => {
          info.instances.forEach((ring: RingInstance) => {
            ring.thickness = 4;
          });
        },
      },
    };
  }

  async start() {
    EasingUtil.modify(
      this.rings,
      [RingLayer.attributeNames.radius],
      (easing, ring, i) => {
        ring.radius = 50 + i * 34;
        easing.setTiming(i * 100, 1000);
      }
    );

    this.labels.forEach((lbl, i) => {
      const radius = 50 + i * 34 + 15;
      lbl.origin = add2(lbl.origin, scale2(normalize2([1, 1]), radius));
      lbl.color = [1, 1, 1, 1];

      EasingUtil.modify(
        lbl.glyphs,
        [GlyphLayer.attributeNames.origin, GlyphLayer.attributeNames.color],
        (easing) => {
          easing.setTiming(i * 100, 1000);
        }
      );
    });

    await onAnimationLoop(
      () => {
        this.label.text = `${Math.round(Math.random() * 100)}`;
      },
      undefined,
      500
    );

    this.label.text = "97";
  }
}
