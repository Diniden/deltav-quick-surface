import { Lookup } from "deltav";
export declare function lookupValues<T>(check: (val?: Lookup<T | undefined> | T) => val is T, lookup: Lookup<T | undefined>): T[];
