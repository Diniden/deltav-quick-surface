import { Lookup } from "deltav";

/**
 * Retrieve a property from an object using a list of keys
 */
export function deleteProp<T>(
  target: Lookup<T | undefined>,
  keys: string[]
): boolean {
  let current: Lookup<T | undefined> | T | undefined = target;
  if (current === void 0) return current;

  // Loop through the keys to select the appropriate object within the object
  for (let i = 0, iMax = keys.length - 1; i < iMax; ++i) {
    const key = keys[i];
    // We caste to any as we're doing a loop into an object and there isn't a really good way to have deep diving type
    current = (current as any)[key];
    // If we hit a null or undefined object prematurely, then our key path is invalid for this object, thus no deletion
    if (current === void 0 || current === null) return false;
  }

  // Use the last key as the target item for deletion
  if (current === void 0 || current === null) return false;
  return delete (current as any)[keys[keys.length - 1]];
}
