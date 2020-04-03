import { BasicCamera2DController, Camera2D } from "deltav";
import { QuickView, view } from "../../src";

/**
 * Builds a box of evenly sized views that will fill the screen.
 */
export function makeViews(count: number) {
  let countForSide = 1;
  while (countForSide * countForSide < count) countForSide++;
  const viewWidth = 100 / countForSide;
  const viewHeight = 100 / countForSide;
  const views: QuickView[] = [];

  for (let i = 0, iMax = countForSide; i < iMax; ++i) {
    for (let k = 0; k < countForSide; ++k) {
      const camera = new Camera2D();
      const manager = new BasicCamera2DController({
        camera,
        startView: [""],
      });

      views.push(
        view({
          viewport: {
            left: `${i * viewWidth}%`,
            top: `${k * viewHeight}%`,
            width: `${viewWidth}%`,
            height: `${viewHeight}%`,
          },
          camera,
          manager,
        })
      );
    }
  }

  let current = -1;

  return () => views[++current];
}
