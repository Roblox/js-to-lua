import {
  callExpression as babelCallExpression,
  identifier as babelIdentifier,
  memberExpression as babelMemberExpression,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  dateTimeMethodCall,
  PolyfillID,
  stringInferableExpression,
  withPolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  indexExpression,
  LuaCallExpression,
  memberExpression,
  numericLiteral,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { createCallExpressionHandler } from './call-expression.handler';
import { expressionHandler } from '../../expression-statement.handler';
import {
  ADD_POLYFILL_EXTRA_IN_CALL_EXPRESSION,
  USE_DOT_NOTATION_IN_CALL_EXPRESSION,
} from './special-cases/call-expression-dot-notation.handler';

const source = '';

const handleCallExpression = createCallExpressionHandler(
  expressionHandler.handler
);

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

    describe.each(
      USE_DOT_NOTATION_IN_CALL_EXPRESSION.filter(
        (e): e is string =>
          typeof e === 'string' &&
          !ADD_POLYFILL_EXTRA_IN_CALL_EXPRESSION.includes(e as PolyfillID)
      ).filter((e) => e !== 'chalk')
    )('dot notation special cases without polyfill imports: %s', (id) => {
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

    describe('dot notation special cases without polyfill imports: chalk', () => {
      const id = 'chalk';
      it(`should handle not computed ${id} object`, () => {
        const given = babelCallExpression(
          babelMemberExpression(babelIdentifier(id), babelIdentifier('foo')),
          []
        );

        const expected = stringInferableExpression(
          callExpression(
            memberExpression(identifier(id), '.', identifier('foo')),
            []
          )
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

        const expected = stringInferableExpression(
          callExpression(
            indexExpression(identifier(id), stringLiteral('foo')),
            []
          )
        );

        expect(handleCallExpression.handler(source, {}, given)).toEqual(
          expected
        );
      });
    });

    describe.each(
      USE_DOT_NOTATION_IN_CALL_EXPRESSION.filter(
        (e): e is string =>
          typeof e === 'string' &&
          ADD_POLYFILL_EXTRA_IN_CALL_EXPRESSION.includes(e as PolyfillID)
      )
    )('dot notation special cases with polyfill import: %s', (id) => {
      it(`should handle not computed ${id} object`, () => {
        const given = babelCallExpression(
          babelMemberExpression(babelIdentifier(id), babelIdentifier('foo')),
          []
        );

        const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
          id as PolyfillID
        )(
          callExpression(
            memberExpression(identifier(id), '.', identifier('foo')),
            []
          )
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

        const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
          id as PolyfillID
        )(
          callExpression(
            indexExpression(identifier(id), stringLiteral('foo')),
            []
          )
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

    it('should handle Date.now() call', () => {
      const given = babelCallExpression(
        babelMemberExpression(babelIdentifier('Date'), babelIdentifier('now')),
        []
      );

      const expected = memberExpression(
        dateTimeMethodCall('now'),
        '.',
        identifier('UnixTimestampMillis')
      );
      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle parseInt simple function call', () => {
      const given = babelCallExpression(babelIdentifier('parseInt'), [
        babelIdentifier('foo'),
      ]);

      const expected = callExpression(identifier('tonumber'), [
        identifier('foo'),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle parseInt with base function call', () => {
      const given = babelCallExpression(babelIdentifier('parseInt'), [
        babelIdentifier('foo'),
        babelNumericLiteral(16),
      ]);

      const expected = callExpression(identifier('tonumber'), [
        identifier('foo'),
        numericLiteral(16),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });
  });
});
