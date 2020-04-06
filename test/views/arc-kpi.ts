import {
  AnchorType,
  ArcInstance,
  Bounds,
  Color,
  LabelInstance,
  onAnimationLoop,
} from "deltav";
import { rand } from "../util/rand";
import { Base } from "./base";

const START_ANGLE = -Math.PI / 2;

export class ArcKPI extends Base {
  arcs: ArcInstance[];
  label: LabelInstance;

  getData(bounds: Bounds<any>) {
    this.arcs = new Array(20).fill(0).map((_, i) => {
      const color: Color = [rand(), rand(), rand(), 1];
      return new ArcInstance({
        angle: [START_ANGLE, START_ANGLE],
        center: bounds.mid,
        colorStart: color,
        colorEnd: color,
        radius: 50 + i * 7,
        thickness: [5, 5],
      });
    });

    this.label = new LabelInstance({
      color: [1, 1, 1, 1],
      origin: bounds.mid,
      text: "0",
      fontSize: 20,
      anchor: {
        type: AnchorType.Middle,
        padding: 0,
      },
    });

    return {
      arcs: this.arcs,
      label: [this.label],
    };
  }

  async start() {
    let next = 0;
    const max = Math.PI * 2;
    const spacing = max / this.arcs.length;

    this.arcs.forEach((arc) => {
      next += spacing;
      arc.angle = [START_ANGLE, START_ANGLE + max - next];
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
