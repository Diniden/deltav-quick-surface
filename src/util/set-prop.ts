import { Lookup } from "deltav";

/**
 * Retrieve a property from an object using a list of keys
 */
export function setProp<T>(target: Lookup<T>, value: T, keys: string[]) {
  let current: Lookup<T> | T = target;

  for (let i = 0, iMax = keys.length - 1; i < iMax; ++i) {
    const key = keys[i];
    // We caste to any as we're doing a loop into an object and there isn't a really good way to have deep diving
    current = (current as any)[key] = (current as any)[key] || {};
  }

  if (keys.length > 0) {
    (current as any)[keys[keys.length - 1]] = value;
    return true;
  }

  return false;
}
