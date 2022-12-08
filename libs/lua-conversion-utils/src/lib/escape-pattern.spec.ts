/* eslint-disable no-useless-escape */
import { escapePattern } from './escape-pattern';

describe('escapePattern', () => {
  it.each([
    {
      pattern: '\\(?![{}()+?.^$])',
      escaped: '\\\\(?![{}()+?.^$])',
    },
    { pattern: '(/|\\(?!.))', escaped: '(/|\\\\(?!.))' },
    {
      pattern: '\\s*at.*\\(?(:\\d*:\\d*|native)\\)?',
      escaped: '\\\\s*at.*\\\\(?(:\\\\d*:\\\\d*|native)\\\\)?',
    },
    { pattern: '(\\s)', escaped: '(\\\\s)' },
    { pattern: '(\\b)', escaped: '(\\\\b)' },
    {
      pattern: '[\\u001b\\u009b]\\[\\d{1,2}m',
      escaped: '[\\\\u001b\\\\u009b]\\\\[\\\\d{1,2}m',
    },
    {
      pattern: '[^.[\\]]+|(?=(?:\\.)(?:\\.|$))',
      escaped: '[^.[\\\\]]+|(?=(?:\\\\.)(?:\\\\.|$))',
    },
  ])(
    'should produce properly escape backslash chars in "$pattern"',
    ({ pattern, escaped }) => {
      expect(escapePattern(pattern)).toBe(escaped);
    }
  );
});
