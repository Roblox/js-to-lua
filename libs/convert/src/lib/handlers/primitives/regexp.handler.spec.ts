import * as Babel from '@babel/types';
import {
  regexpIdentifier,
  withNeedsRegExpExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import { callExpression, stringLiteral } from '@js-to-lua/lua-types';
import { createRegExpLiteralHandler } from './regexp.handler';

const source = '';

describe('String Handler', () => {
  const { handler } = createRegExpLiteralHandler();

  it.each([
    { pattern: 'a' },
    { pattern: 'a{1,2}?' },
    { pattern: 'a[bc]+' },
    { pattern: '(?![{}()+?.^$])' },
    { pattern: 's*at.*(?(:d*:d*|native))?' },
    { pattern: '"hello"' },
  ])(`should return Lua Regexp Node with value '$pattern'`, ({ pattern }) => {
    const given = Babel.regExpLiteral(pattern);
    const expected = withNeedsRegExpExtra(
      callExpression(regexpIdentifier, [stringLiteral(pattern)])
    );
    expect(handler(source, {}, given)).toEqual(expected);
  });

  it.each([
    { pattern: '(?![{}()+?.^$])', flag: 'i' },
    { pattern: 'a{1,2}?', flag: 'i' },
    { pattern: '"hello"', flag: 'i' },
    { pattern: '[\u001b\u009b][d{1,2}m', flag: 'u' },
  ])(
    `should return Lua Regexp Node with value '$pattern' and flag '$flag'`,
    ({ pattern, flag }) => {
      const given = Babel.regExpLiteral(pattern, flag);
      const expected = withNeedsRegExpExtra(
        callExpression(regexpIdentifier, [
          stringLiteral(pattern),
          stringLiteral(flag),
        ])
      );
      expect(handler(source, {}, given)).toEqual(expected);
    }
  );

  it.each([
    { pattern: 'a{1,2}?', flag: 'g' },
    { pattern: '(?![{}()+?.^$])', flag: 'gi' },
    { pattern: '"hello"', flag: 'g' },
    { pattern: '[\u001b\u009b][d{1,2}m', flag: 'gu' },
    { pattern: 's*at.*(?(:d*:d*|native))?', flag: 'gi' },
  ])(
    `should add trailing comments for global flags in regex pattern '$pattern'`,
    ({ pattern, flag }) => {
      const given = Babel.regExpLiteral(pattern, flag);
      const expected = withTrailingConversionComment(
        withNeedsRegExpExtra(
          callExpression(regexpIdentifier, [
            stringLiteral(pattern),
            stringLiteral(flag),
          ])
        ),
        `ROBLOX NOTE: global flag is not implemented yet`
      );
      expect(handler(source, {}, given)).toEqual(expected);
    }
  );
});
