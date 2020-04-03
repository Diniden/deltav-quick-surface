/**
 * Simply add tests to this file or folder. WHen you run the test command it will run all .test.js files in this
 * folder.
 */

import assert from 'assert';
import { Lookup } from 'deltav';
import { describe, it } from 'mocha';
import { getProp } from '../src/util/get-prop';

class Instance {}

/** A simple data object to test against */
const data = {
  main: {
    yo: {
      hey: [new Instance(), new Instance(), new Instance()],
      test: [new Instance(), new Instance(), new Instance()],
      single: new Instance()
    },
    test: [new Instance(), new Instance(), new Instance()],
    single: new Instance()
  },
  awesome: [new Instance(), new Instance(), new Instance()],
  single: new Instance()
};

describe('getProp', () => {
  it ('Should retrieve the property', () => {
    assert(getProp(data, ['main', 'yo', 'hey']) === data.main.yo.hey);
    assert(getProp(data, ['main', 'yo', 'single']) === data.main.yo.single);
    assert(getProp(data, ['main', 'test']) === data.main.test);
    assert(getProp(data, ['main', 'single']) === data.main.single);
    assert(getProp(data, ['awesome']) === data.awesome);
    assert(getProp(data, ['single']) === data.single);
  });

  it ('Should return undefined and not error', () => {
    assert(getProp(data, ['main', 'yo', 'hey', 'fail']) === void 0);
    assert(getProp(data, ['main', 'yo', 'single', 'fail']) === void 0);
    assert(getProp(data, ['main', 'test', 'fail']) === void 0);
    assert(getProp(data, ['main', 'single', 'fail']) === void 0);
    assert(getProp(data, ['awesome', 'fail']) === void 0);
    assert(getProp(data, ['single', 'fail']) === void 0);
    assert(getProp(data, ['fail']) === void 0);
    assert(getProp(data, ['fail', 'fail', 'fail']) === void 0);
  });
});
