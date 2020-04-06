import { CircleInstance, ICircleInstanceOptions } from "deltav";
import { rand } from "../util/rand";
import { Base } from "./base";

interface IDataPoint extends ICircleInstanceOptions {
  pointProperty: string;
  special: number;
}

class DataPoint extends CircleInstance {
  pointProperty: string = "";
  special: number = 10;

  constructor(options: IDataPoint) {
    super(options);
    this.pointProperty = options.pointProperty;
    this.special = options.special;
  }
}

/**
 * This is a test set up to make sure we can inherit certain data types and still see appropriate results.
 */
export class InheritedDataTypes extends Base {
  data: DataPoint[];

  getData() {
    const data: DataPoint[] = [];

    for (let i = 0; i < 100; ++i) {
      for (let k = 0; k < 100; ++k) {
        data.push(
          new DataPoint({
            center: [i * 10, k * 10],
            radius: 0,
            color: [rand(0.2, 0.3), rand(0.5, 0.7), 1, 1],
            pointProperty: "hey",
            special: 10,
          })
        );
      }
    }

    this.data = data;

    return {
      points: data,
    };
  }

  getHandlers(): ReturnType<Base["getHandlers"]> {
    return {
      onMouseOver: {
        points: (info) => {
          info.instances.forEach(
            (p: DataPoint) => (p.color = [1, rand(0.2, 1), rand(0.2, 1), 1])
          );
        },
      },
    };
  }

  async start() {
    this.data.forEach((p) => (p.radius = 5));
  }
}
