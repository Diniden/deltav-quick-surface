import { Lookup } from "deltav";
import { DeepMap } from "../types";
export declare function getProp<T>(target: Lookup<T | undefined> | DeepMap<any, any, T | undefined>, keys: string[]): Lookup<T | undefined> | T | undefined;
