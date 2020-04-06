import { Lookup } from "deltav";
import { DeepMap } from "../types";
export declare function mapLookupValues<TInput, TLookup extends Lookup<TInput>, TOutput>(label: string, check: (value: TInput | TLookup) => value is TInput, lookup: TLookup, callback: (key: string[], value: TInput) => TOutput): DeepMap<TLookup, TInput, TOutput>;
