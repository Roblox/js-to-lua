import {
  identifier,
  indexExpression,
  memberExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { memberExpressionFromPath } from './member-expression-from-path';

describe('Member Expression from path', () => {
  describe('without unhandled characters', () => {
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
        memberExpression(identifier('foo'), '.', identifier('bar')),
        '.',
        identifier('baz')
      );

      expect(memberExpressionFromPath(given)).toEqual(expected);
    });

    it('should create member expression from 5 path elements', () => {
      const given = ['foo', 'bar', 'baz', 'fizz', 'buzz'];
      const expected = memberExpression(
        memberExpression(
          memberExpression(
            memberExpression(identifier('foo'), '.', identifier('bar')),
            '.',
            identifier('baz')
          ),
          '.',
          identifier('fizz')
        ),
        '.',
        identifier('buzz')
      );

      expect(memberExpressionFromPath(given)).toEqual(expected);
    });
  });

  describe('with unhandled characters', () => {
    it('should create member expression from 2 path elements', () => {
      const given = ['foo', '@bar'];
      const expected = indexExpression(
        identifier('foo'),
        stringLiteral('@bar')
      );

      expect(memberExpressionFromPath(given)).toEqual(expected);
    });

    it('should create member expression from 3 path elements', () => {
      const given = ['foo', '@bar', '@baz'];
      const expected = indexExpression(
        indexExpression(identifier('foo'), stringLiteral('@bar')),
        stringLiteral('@baz')
      );

      const actual = memberExpressionFromPath(given);
      expect(actual).toEqual(expected);
    });

    it('should create member expression from 5 path elements', () => {
      const given = ['foo', '@bar', '@baz', '@fizz', '@buzz'];
      const expected = indexExpression(
        indexExpression(
          indexExpression(
            indexExpression(identifier('foo'), stringLiteral('@bar')),
            stringLiteral('@baz')
          ),
          stringLiteral('@fizz')
        ),
        stringLiteral('@buzz')
      );

      expect(memberExpressionFromPath(given)).toEqual(expected);
    });
  });
});
