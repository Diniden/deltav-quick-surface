import { PerlinNoise } from "@diniden/signal-processing";
import {
  Bounds,
  CircleInstance,
  Color,
  Instance,
  InstanceProvider,
  Lookup,
} from "deltav";
import { Base } from "./base";

const DIM: Color = [1, 1, 1, 0.2];
const WHITE: Color = [1, 1, 1, 1];
const ORANGE: Color = [1, 0.5, 0.2, 1];
const RED: Color = [1, 0, 0.2, 1];

export class Circles extends Base {
  circles: CircleInstance[];
  bounds: Bounds<any>;

  getData(bounds: Bounds<any>) {
    this.bounds = bounds;
    const { width, height } = bounds;

    const circles = new Array(20000).fill(0).map(
      () =>
        new CircleInstance({
          center: [Math.random() * width, Math.random() * height],
          color: DIM,
          radius: 0,
        })
    );

    this.circles = circles;

    return {
      circles: {
        test: circles.slice(0, circles.length / 4),
        split: circles.slice(circles.length / 4, (circles.length / 4) * 2),
        up: circles.slice((circles.length / 4) * 2, (circles.length / 4) * 3),
        circles: circles.slice((circles.length / 4) * 3, circles.length),
      },
    };
  }

  getHandlers(): ReturnType<Base["getHandlers"]> {
    const radius = new Map();

    return {
      onMouseOver: {
        circles: (info) => {
          info.instances.forEach((circle: CircleInstance) => {
            let r = radius.get(circle);

            if (r === void 0) {
              r = circle.radius;
              radius.set(circle, r);
            }

            circle.radius = r + 10;
          });
        },
      },

      onMouseOut: {
        circles: {
          test: (info) => {
            info.instances.forEach((circle: CircleInstance) => {
              const r = radius.get(circle);

              if (r !== void 0) {
                circle.radius = r;
              }

              radius.delete(circle);
            });
          },
          split: (info) => {
            info.instances.forEach((circle: CircleInstance) => {
              const r = radius.get(circle);

              if (r !== void 0) {
                circle.radius = r;
              }

              radius.delete(circle);
            });
          },
          up: (info) => {
            info.instances.forEach((circle: CircleInstance) => {
              const r = radius.get(circle);

              if (r !== void 0) {
                circle.radius = r;
              }

              radius.delete(circle);
            });
          },
        },
      },
    };
  }

  async start(_providers: Lookup<InstanceProvider<Instance>>) {
    const bounds = this.bounds;
    const { width, height } = bounds;
    const perlin = new PerlinNoise({
      // Dimensions of the data array the perlin will be in
      width: 128,
      height: 128,
      // How much blurring is done to combine octaves together
      blendPasses: 5,
      // Octaves are expected feature sizes [width, height]. Smaller features create more details in the noise, while
      // octaves closer to the noise data size creates larger features.
      octaves: [
        [8, 8],
        [16, 16],
        [64, 64],
      ],
      // This is the range the value will output as for each perlin data cell
      valueRange: [0, 1],
    });

    perlin.generate();
    const perlinSample = perlin.sample(0, 0, perlin.width, perlin.height, 0.2);

    this.circles.forEach((p) => {
      let sample =
        perlinSample[Math.floor((p.center[0] / width) * perlin.width)][
          Math.floor((p.center[1] / height) * perlin.height)
        ];
      sample = Math.random() * sample;

      if (sample > 0.8) {
        p.color = RED;
        p.radius = 5 + Math.random();
      } else if (sample > 0.4) {
        p.color = ORANGE;
        p.radius = 2 + Math.random();
      } else if (sample > 0.2) {
        p.color = WHITE;
        p.radius = 2 + Math.random();
      } else {
        p.color = DIM;
        p.radius = 1 + Math.random();
      }

      return sample > 0.1;
    });
  }
}
