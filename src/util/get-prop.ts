import { Lookup } from "deltav";
import { DeepMap } from "../types";

/**
 * Retrieve a property from an object using a list of keys
 */
export function getProp<T>(
  target: Lookup<T | undefined> | DeepMap<any, any, T | undefined>,
  keys: string[]
): Lookup<T | undefined> | T | undefined {
  let current: Lookup<T | undefined> | T | undefined = target;
  if (current === void 0) return current;

  for (let i = 0, iMax = keys.length; i < iMax; ++i) {
    const key = keys[i];
    // We caste to any as we're doing a loop into an object and there isn't a really good way to have deep diving
    current = (current as any)[key];
    if (current === void 0 || current === null) return;
  }

  return current;
}
