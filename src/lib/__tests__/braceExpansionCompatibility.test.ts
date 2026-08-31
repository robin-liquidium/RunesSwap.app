type BraceExpansion = ((pattern: string) => string[]) & {
  expand: BraceExpansion;
  EXPANSION_MAX: number;
  EXPANSION_MAX_LENGTH: number;
};

const expand = require('brace-expansion') as BraceExpansion;
const minimatch = require('minimatch') as (value: string, pattern: string) => boolean;
const { globSync } = require('glob') as {
  globSync: (pattern: string) => string[];
};

describe('brace-expansion CommonJS compatibility', () => {
  it('preserves the callable API and minimatch 3 integration', () => {
    expect(typeof expand).toBe('function');
    expect(expand.expand).toBe(expand);
    expect(expand('file.{js,ts}')).toEqual(['file.js', 'file.ts']);
    expect(expand.EXPANSION_MAX).toEqual(expect.any(Number));
    expect(expand.EXPANSION_MAX_LENGTH).toEqual(expect.any(Number));
    expect(minimatch('file.ts', 'file.{js,ts}')).toBe(true);
    expect(globSync('src/lib/__tests__/braceExpansionCompatibility.{test,spec}.ts')).toEqual([
      'src/lib/__tests__/braceExpansionCompatibility.test.ts',
    ]);
  });
});
