import { Lookup } from "deltav";

/**
 * This gets all of the values of a Lookup
 */
export function lookupValues<T>(
  check: (val?: Lookup<T | undefined> | T) => val is T,
  lookup: Lookup<T | undefined>
): T[] {
  const out: T[] = [];
  const toProcess = Object.values(lookup);

  for (let index = 0; index < toProcess.length; ++index) {
    const next = toProcess[index];

    if (check(next)) {
      out.push(next as T);
    } else if (next !== void 0 && next !== null) {
      toProcess.push(...Object.values(next));
    }
  }

  return out;
}
