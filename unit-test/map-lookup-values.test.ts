/**
 * Simply add tests to this file or folder. WHen you run the test command it will run all .test.js files in this
 * folder.
 */

import assert from 'assert';
import { Lookup } from 'deltav';
import { describe, it } from 'mocha';
import { mapLookupValues } from '../src/util/map-lookup-values';

class Instance {}
class InstanceProvider {}

/** A simple data object to test against */
const data = {
  main: {
    yo: {
      hey: [new Instance(), new Instance(), new Instance()],
      test: [new Instance(), new Instance(), new Instance()],
      single: [new Instance()]
    },
    test: [new Instance(), new Instance(), new Instance()],
    single: [new Instance()]
  },
  awesome: [new Instance(), new Instance(), new Instance()],
  single: [new Instance()]
};

function isInstanceType(value: Instance[] | Lookup<Instance[]>): value is Instance[] {
  return Array.isArray(value) || value instanceof Instance;
}

describe('mapLookupValues', () => {
  it ('Should evaluate to Instance or Instance Array', () => {
    assert(isInstanceType(data.main.yo.hey));
    assert(isInstanceType(data.main.yo.single));
    assert(isInstanceType(data.main.test));
    assert(isInstanceType(data.main.single));
    assert(isInstanceType(data.awesome));
    assert(isInstanceType(data.single));
  });

  it ('Should map all to Instance Providers', () => {
    const mapped = mapLookupValues("TestMapping", isInstanceType, data, () => new InstanceProvider());

    assert(mapped.main.yo.hey instanceof InstanceProvider);
    assert(mapped.main.yo.single instanceof InstanceProvider);
    assert(mapped.main.test instanceof InstanceProvider);
    assert(mapped.main.single instanceof InstanceProvider);
    assert(mapped.awesome instanceof InstanceProvider);
    assert(mapped.single instanceof InstanceProvider);
  });
});
