import assert from 'node:assert/strict';
import braces from 'braces';

assert.deepEqual(braces('{a,b}'), ['(a|b)']);

const deeplyNestedPattern = `${'{'.repeat(101)}a${'}'.repeat(101)}`;
assert.throws(() => braces.compile(deeplyNestedPattern), {
  name: 'RangeError',
  message: /exceeds max depth/,
});
