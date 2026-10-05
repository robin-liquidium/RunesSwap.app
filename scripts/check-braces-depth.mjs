import assert from 'node:assert/strict';
import braces from 'braces';

assert.deepEqual(braces('{a,b}'), ['(a|b)']);

const deeplyNestedPattern = `${'{'.repeat(101)}a${'}'.repeat(101)}`;
assert.throws(() => braces.compile(deeplyNestedPattern), {
  name: 'RangeError',
  message: /exceeds max depth/,
});

const deeplyNestedParentheses = `${'('.repeat(101)}a${')'.repeat(101)}`;
for (const operation of [braces.compile, braces.expand, braces.stringify]) {
  assert.throws(() => operation(deeplyNestedParentheses), {
    name: 'RangeError',
    message: /exceeds max depth/,
  });
}

const deeplyNestedAst = () => {
  const root = { type: 'root', nodes: [] };
  let parent = root;

  for (let index = 0; index < 101; index++) {
    const child = { type: 'brace', nodes: [], parent };
    parent.nodes.push(child);
    parent = child;
  }

  parent.nodes.push({ type: 'text', value: 'a', parent });
  return root;
};

for (const operation of [braces.compile, braces.expand, braces.stringify]) {
  assert.throws(() => operation(deeplyNestedAst()), {
    name: 'RangeError',
    message: /exceeds max depth/,
  });
}

assert.deepEqual(braces.compile('{a,{b,c}}'), '(a|(b|c))');
assert.deepEqual(braces.expand('a/(b|c)/{d,e}'), ['a/(b|c)/d', 'a/(b|c)/e']);
assert.equal(braces.stringify(braces.parse('{a,b}')), '{a,b}');
