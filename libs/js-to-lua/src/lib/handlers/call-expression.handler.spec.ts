import {
  callExpression as babelCallExpression,
  identifier as babelIdentifier,
  memberExpression as babelMemberExpression,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  callExpression,
  identifier,
  indexExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import {
  handleCallExpression,
  USE_DOT_NOTATION_IN_CALL_EXPRESSION,
} from './expression-statement.handler';

const source = '';

describe('Call Expression Handler', () => {
  it(`should return Call with no parameters`, () => {
    const given = babelCallExpression(babelIdentifier('Symbol'), []);

    const expected = callExpression(identifier('Symbol'), []);

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Call with parameters`, () => {
    const given = babelCallExpression(babelIdentifier('test'), [
      babelNumericLiteral(5),
      babelStringLiteral('wole'),
    ]);

    const expected = callExpression(identifier('test'), [
      numericLiteral(5),
      stringLiteral('wole'),
    ]);

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle computed member expressions`, () => {
    const given = babelCallExpression(
      babelMemberExpression(
        babelIdentifier('foo'),
        babelStringLiteral('bar'),
        true
      ),
      [babelStringLiteral('baz')]
    );

    const expected = callExpression(
      indexExpression(identifier('foo'), stringLiteral('bar')),
      [identifier('foo'), stringLiteral('baz')]
    );

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle not computed member expressions`, () => {
    const given = babelCallExpression(
      babelMemberExpression(babelIdentifier('foo'), babelIdentifier('bar')),
      [babelStringLiteral('baz')]
    );

    const expected = callExpression(
      memberExpression(identifier('foo'), ':', identifier('bar')),
      [stringLiteral('baz')]
    );

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  describe('Special cases', () => {
    it(`should handle not computed toString() method`, () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelIdentifier('foo'),
          babelIdentifier('toString')
        ),
        []
      );

      const expected = callExpression(identifier('tostring'), [
        identifier('foo'),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle computed toString() method`, () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelIdentifier('foo'),
          babelStringLiteral('toString'),
          true
        ),
        []
      );

      const expected = callExpression(identifier('tostring'), [
        identifier('foo'),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle treat toString() method as a regular method when it has arguments`, () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelIdentifier('foo'),
          babelStringLiteral('toString'),
          true
        ),
        [babelStringLiteral('bar')]
      );

      const expected = callExpression(
        indexExpression(identifier('foo'), stringLiteral('toString')),
        [identifier('foo'), stringLiteral('bar')]
      );

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    USE_DOT_NOTATION_IN_CALL_EXPRESSION.filter(
      (e): e is string => typeof e === 'string'
    ).forEach((id) => {
      it(`should handle not computed ${id} object`, () => {
        const given = babelCallExpression(
          babelMemberExpression(babelIdentifier(id), babelIdentifier('foo')),
          []
        );

        const expected = callExpression(
          memberExpression(identifier(id), '.', identifier('foo')),
          []
        );
        expect(handleCallExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });

      it(`should handle computed ${id} object`, () => {
        const given = babelCallExpression(
          babelMemberExpression(
            babelIdentifier(id),
            babelStringLiteral('foo'),
            true
          ),
          []
        );

        const expected = callExpression(
          indexExpression(identifier(id), stringLiteral('foo')),
          []
        );
        expect(handleCallExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });
    });

    it('should handle method calls on expect Jest helper', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelCallExpression(babelIdentifier('expect'), [
            babelIdentifier('foo'),
          ]),
          babelIdentifier('toEqual')
        ),
        [babelIdentifier('bar')]
      );

      const expected = callExpression(
        memberExpression(
          callExpression(identifier('expect'), [identifier('foo')]),
          '.',
          identifier('toEqual')
        ),
        [identifier('bar')]
      );
      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle chained method calls on expect Jest helper', () => {
      const given = babelCallExpression(
        babelMemberExpression(
          babelMemberExpression(
            babelCallExpression(babelIdentifier('expect'), [
              babelIdentifier('foo'),
            ]),
            babelIdentifier('never')
          ),
          babelIdentifier('toEqual')
        ),
        [babelIdentifier('bar')]
      );

      const expected = callExpression(
        memberExpression(
          memberExpression(
            callExpression(identifier('expect'), [identifier('foo')]),
            '.',
            identifier('never')
          ),
          '.',
          identifier('toEqual')
        ),
        [identifier('bar')]
      );
      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });
  });
});
