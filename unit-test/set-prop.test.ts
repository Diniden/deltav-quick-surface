/**
 * Simply add tests to this file or folder. WHen you run the test command it will run all .test.js files in this
 * folder.
 */

import assert from 'assert';
import { Lookup } from 'deltav';
import { describe, it } from 'mocha';
import { setProp } from '../src/util/set-prop';

class Instance {}

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

describe('setProp', () => {
  it ('Should apply the property', () => {
    const appliedInstance = new Instance();
    assert(setProp(data, appliedInstance, ['main', 'yo', 'hey']) && data.main.yo.hey === appliedInstance);
    assert(setProp(data, appliedInstance, ['main', 'yo', 'single']) && data.main.yo.single === appliedInstance);
    assert(setProp(data, appliedInstance, ['main', 'test']) && data.main.test === appliedInstance);
    assert(setProp(data, appliedInstance, ['main', 'single']) && data.main.single === appliedInstance);
    assert(setProp(data, appliedInstance, ['awesome']) && data.awesome === appliedInstance);
    assert(setProp(data, appliedInstance, ['single']) && data.single === appliedInstance);
    assert(setProp(data, appliedInstance, ['does', 'not', 'exist']) && (data as any).does.not.exist === appliedInstance);
  });
});
