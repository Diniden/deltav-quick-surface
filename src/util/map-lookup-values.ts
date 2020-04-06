import { Lookup } from "deltav";
import { DeepMap } from "../types";

/**
 * This takes a lookup and maps all of it's values to another lookup with different values but with the same keys.
 */
export function mapLookupValues<
  TInput,
  TLookup extends Lookup<TInput>,
  TOutput
>(
  label: string,
  check: (value: TInput | TLookup) => value is TInput,
  lookup: TLookup,
  callback: (key: string[], value: TInput) => TOutput
): DeepMap<TLookup, TInput, TOutput> {
  const added = new Set();
  // We have to initialize the output lookup as empty since we are building it with this method. Thus the needed
  // casting.
  const out: DeepMap<TLookup, TInput, TOutput> = {} as DeepMap<
    TLookup,
    TInput,
    TOutput
  >;

  const toProcess = Object.keys(lookup).map<[string[], TInput | TLookup]>(
    (key) => [[key], (lookup as any)[key]]
  );

  for (let index = 0; index < toProcess.length; ++index) {
    const next: [string[], TInput | TLookup] = toProcess[index];

    if (check(next[1])) {
      // Get the object that we are mapping to using the callback provided.
      const mappedObject = callback(next[0], next[1]);
      // We will now use the stored keys to drill down into the output object to provide the outputted mapped object
      // and ensure all keys exist in the object for the drilldown to thus complete the mapping.
      const keys = next[0];
      // Can waste a lot of time trying to get this type correct. Essentially we are making a reference to the next
      // level of key that we are accessing. This should be keys that match the 'lookup' parameter's lookup keys and
      // should be applied to the output.
      let nextRef: any = out;

      for (let i = 0, iMax = keys.length; i < iMax; ++i) {
        const accessKey = keys[i];

        // If we are at the last key, we should apply the object we pulled from the mapping callback
        if (i === keys.length - 1) {
          nextRef[accessKey] = mappedObject;
        }

        // If we are at a key that will have more keys that need processing, then we just ensure an object is present
        // for the given key and we use that keys object as our next step in drilling down the object lookups.
        else {
          if (!nextRef[accessKey]) {
            nextRef[accessKey] = {};
          }

          nextRef = nextRef[accessKey];
        }
      }
    } else {
      let error = false;

      Object.keys(next[1]).forEach((key) => {
        const value = (next[1] as any)[key];

        if (!added.has(value)) {
          toProcess.push([next[0].concat(key), value]);
          added.add(value);
        } else {
          error = true;
          console.warn("Invalid lookup for mapping values detected:", label);
        }
      });

      if (error) break;
    }
  }

  return out;
}
