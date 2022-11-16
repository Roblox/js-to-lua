import * as Babel from '@babel/types';
import {
  dateTimeMethodCall,
  PolyfillID,
  stringInferableExpression,
  withPolyfillExtra,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  functionExpression,
  identifier,
  indexExpression,
  LuaCallExpression,
  memberExpression,
  nodeGroup,
  numericLiteral,
  returnStatement,
  stringLiteral,
} from '@js-to-lua/lua-types';
import { expressionHandler } from '../../expression-statement.handler';
import { createCallExpressionHandler } from './call-expression.handler';
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
    const given = Babel.callExpression(Babel.identifier('Hello'), []);

    const expected = callExpression(identifier('Hello'), []);

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Call with parameters`, () => {
    const given = Babel.callExpression(Babel.identifier('test'), [
      Babel.numericLiteral(5),
      Babel.stringLiteral('wole'),
    ]);

    const expected = callExpression(identifier('test'), [
      numericLiteral(5),
      stringLiteral('wole'),
    ]);

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle computed member expressions`, () => {
    const given = Babel.callExpression(
      Babel.memberExpression(
        Babel.identifier('foo'),
        Babel.stringLiteral('bar'),
        true
      ),
      [Babel.stringLiteral('baz')]
    );

    const expected = callExpression(
      indexExpression(identifier('foo'), stringLiteral('bar')),
      [identifier('foo'), stringLiteral('baz')]
    );

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle not computed member expressions`, () => {
    const given = Babel.callExpression(
      Babel.memberExpression(Babel.identifier('foo'), Babel.identifier('bar')),
      [Babel.stringLiteral('baz')]
    );

    const expected = callExpression(
      memberExpression(identifier('foo'), ':', identifier('bar')),
      [stringLiteral('baz')]
    );

    expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
  });

  describe('Special cases', () => {
    it(`should handle not computed toString() method`, () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('foo'),
          Babel.identifier('toString')
        ),
        []
      );

      const expected = callExpression(identifier('tostring'), [
        identifier('foo'),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle computed toString() method`, () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('foo'),
          Babel.stringLiteral('toString'),
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
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('foo'),
          Babel.stringLiteral('toString'),
          true
        ),
        [Babel.stringLiteral('bar')]
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
        const given = Babel.callExpression(
          Babel.memberExpression(Babel.identifier(id), Babel.identifier('foo')),
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
        const given = Babel.callExpression(
          Babel.memberExpression(
            Babel.identifier(id),
            Babel.stringLiteral('foo'),
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
        const given = Babel.callExpression(
          Babel.memberExpression(Babel.identifier(id), Babel.identifier('foo')),
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
        const given = Babel.callExpression(
          Babel.memberExpression(
            Babel.identifier(id),
            Babel.stringLiteral('foo'),
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
        const given = Babel.callExpression(
          Babel.memberExpression(Babel.identifier(id), Babel.identifier('foo')),
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
        const given = Babel.callExpression(
          Babel.memberExpression(
            Babel.identifier(id),
            Babel.stringLiteral('foo'),
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

    describe.each(['expect', 'jestExpect'])(
      "dot notation for '%s' methods",
      (expectName) => {
        it(`should handle method calls on ${expectName} Jest helper`, () => {
          const given = Babel.callExpression(
            Babel.memberExpression(
              Babel.callExpression(Babel.identifier(expectName), [
                Babel.identifier('foo'),
              ]),
              Babel.identifier('toEqual')
            ),
            [Babel.identifier('bar')]
          );

          const expected = callExpression(
            memberExpression(
              callExpression(identifier(expectName), [identifier('foo')]),
              '.',
              identifier('toEqual')
            ),
            [identifier('bar')]
          );
          expect(handleCallExpression.handler(source, {}, given)).toEqual(
            expected
          );
        });

        it(`should handle chained method calls on ${expectName} Jest helper`, () => {
          const given = Babel.callExpression(
            Babel.memberExpression(
              Babel.memberExpression(
                Babel.callExpression(Babel.identifier(expectName), [
                  Babel.identifier('foo'),
                ]),
                Babel.identifier('never')
              ),
              Babel.identifier('toEqual')
            ),
            [Babel.identifier('bar')]
          );

          const expected = callExpression(
            memberExpression(
              memberExpression(
                callExpression(identifier(expectName), [identifier('foo')]),
                '.',
                identifier('never')
              ),
              '.',
              identifier('toEqual')
            ),
            [identifier('bar')]
          );
          expect(handleCallExpression.handler(source, {}, given)).toEqual(
            expected
          );
        });
      }
    );

    it('should handle Date.now() call', () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Date'),
          Babel.identifier('now')
        ),
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
      const given = Babel.callExpression(Babel.identifier('parseInt'), [
        Babel.identifier('foo'),
      ]);

      const expected = callExpression(identifier('tonumber'), [
        identifier('foo'),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle parseInt with base function call', () => {
      const given = Babel.callExpression(Babel.identifier('parseInt'), [
        Babel.identifier('foo'),
        Babel.numericLiteral(16),
      ]);

      const expected = callExpression(identifier('tonumber'), [
        identifier('foo'),
        numericLiteral(16),
      ]);

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle bind function call', () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.memberExpression(
            Babel.identifier('greet'),
            Babel.identifier('person'),
            false
          ),
          Babel.identifier('bind')
        ),
        [Babel.identifier('greet'), Babel.stringLiteral('Chris')]
      );

      const expected = functionExpression(
        [identifier('...')],
        nodeGroup([
          returnStatement(
            callExpression(
              memberExpression(identifier('greet'), '.', identifier('person')),
              [identifier('greet'), stringLiteral('Chris'), identifier('...')]
            )
          ),
        ])
      );

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle new Symbol creation', () => {
      const given = Babel.callExpression(Babel.identifier('Symbol'), [
        Babel.stringLiteral('foo'),
      ]);

      const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
        'Symbol'
      )(callExpression(identifier('Symbol'), [stringLiteral('foo')]));

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle Symbol.for call', () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Symbol'),
          Babel.identifier('for')
        ),
        [Babel.stringLiteral('foo')]
      );

      const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
        'Symbol'
      )(
        callExpression(
          memberExpression(identifier('Symbol'), '.', identifier('for_')),
          [stringLiteral('foo')]
        )
      );

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle Symbol["for"] call', () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Symbol'),
          Babel.stringLiteral('for'),
          true
        ),
        [Babel.stringLiteral('foo')]
      );

      const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
        'Symbol'
      )(
        callExpression(
          memberExpression(identifier('Symbol'), '.', identifier('for_')),
          [stringLiteral('foo')]
        )
      );

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle Symbol.aMethod call', () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Symbol'),
          Babel.identifier('aMethod')
        ),
        [Babel.stringLiteral('foo')]
      );

      const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
        'Symbol'
      )(
        callExpression(
          memberExpression(identifier('Symbol'), '.', identifier('aMethod')),
          [stringLiteral('foo')]
        )
      );

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle Symbol[aMethod] call', () => {
      const given = Babel.callExpression(
        Babel.memberExpression(
          Babel.identifier('Symbol'),
          Babel.identifier('aMethod'),
          true
        ),
        [Babel.stringLiteral('foo')]
      );

      const expected = withPolyfillExtra<LuaCallExpression, PolyfillID>(
        'Symbol'
      )(
        callExpression(
          indexExpression(
            identifier('Symbol'),
            callExpression(identifier('tostring'), [identifier('aMethod')])
          ),
          [stringLiteral('foo')]
        )
      );

      expect(handleCallExpression.handler(source, {}, given)).toEqual(expected);
    });
  });
});
