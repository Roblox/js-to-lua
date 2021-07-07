import { identifier, memberExpression } from '@js-to-lua/lua-types';
import { memberExpressionFromPath } from './member-expression-from-path';

describe('Member Expression from path', () => {
  it('should create member expression from 2 path elements', () => {
    const given = ['foo', 'bar'];
    const expected = memberExpression(
      identifier('foo'),
      '.',
      identifier('bar')
    );

    expect(memberExpressionFromPath(given)).toEqual(expected);
  });

  it('should create member expression from 3 path elements', () => {
    const given = ['foo', 'bar', 'baz'];
    const expected = memberExpression(
      identifier('foo'),
      '.',
      memberExpression(identifier('bar'), '.', identifier('baz'))
    );

    expect(memberExpressionFromPath(given)).toEqual(expected);
  });

  it('should create member expression from 5 path elements', () => {
    const given = ['foo', 'bar', 'baz', 'fizz', 'buzz'];
    const expected = memberExpression(
      identifier('foo'),
      '.',
      memberExpression(
        identifier('bar'),
        '.',
        memberExpression(
          identifier('baz'),
          '.',
          memberExpression(identifier('fizz'), '.', identifier('buzz'))
        )
      )
    );

    expect(memberExpressionFromPath(given)).toEqual(expected);
  });
});
