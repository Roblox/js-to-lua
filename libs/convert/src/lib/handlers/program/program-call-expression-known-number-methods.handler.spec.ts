import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  numericLiteral,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Known Number properties', () => {
  it('should convert JS Number methods that have Polyfills', () => {
    const given = getProgramNode(`
      let foo = 123
      Number.isFinite(foo)
      Number.isInteger(foo)
      Number.isNaN(foo)
      Number.isSafeInteger(foo)
    `);

    const expected = programWithUpstreamComment([
      withTrailingConversionComment(
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Packages'))],
          []
        ),
        'ROBLOX comment: must define Packages module'
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                identifier('Packages'),
                '.',
                identifier('LuauPolyfill')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Number'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Number')
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(numericLiteral(123, '123'))]
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('Number'), '.', identifier('isFinite')),
          [identifier('foo')]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('Number'), '.', identifier('isInteger')),
          [identifier('foo')]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(identifier('Number'), '.', identifier('isNaN')),
          [identifier('foo')]
        )
      ),
      expressionStatement(
        callExpression(
          memberExpression(
            identifier('Number'),
            '.',
            identifier('isSafeInteger')
          ),
          [identifier('foo')]
        )
      ),
    ]);

    const actual = convertProgram(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should convert JS Number properties that do NOT have Polyfills', () => {
    const given = getProgramNode(`
      let foo = '123'
      Number.parseFloat(foo)
      Number.parseInt(foo)
    `);

    const expected = programWithUpstreamComment([
      withTrailingConversionComment(
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Packages'))],
          []
        ),
        'ROBLOX comment: must define Packages module'
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                identifier('Packages'),
                '.',
                identifier('LuauPolyfill')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Number'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Number')
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [variableDeclaratorValue(stringLiteral('123'))]
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('parseFloat')
            ),
            [identifier('foo')]
          ),
          'ROBLOX NOTE: Number.parseFloat is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(identifier('Number'), '.', identifier('parseInt')),
            [identifier('foo')]
          ),
          'ROBLOX NOTE: Number.parseInt is currently not supported by the Luau Number polyfill, please add your own implementation or file a ticket on the same'
        )
      ),
    ]);

    const actual = convertProgram(source, {}, given);
    expect(actual).toEqual(expected);
  });

  it('should convert JS Number properties call that are NOT function with a warning', () => {
    const given = getProgramNode(`
      Number.MAX_VALUE()
      Number.MIN_VALUE()
      Number.NaN()
      Number.NEGATIVE_INFINITY()
      Number.POSITIVE_INFINITY()
      Number.MAX_SAFE_INTEGER()
      Number.MIN_SAFE_INTEGER()
      Number.EPSILON()
    `);

    const expected = programWithUpstreamComment([
      withTrailingConversionComment(
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('Packages'))],
          []
        ),
        'ROBLOX comment: must define Packages module'
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('LuauPolyfill'))],
        [
          variableDeclaratorValue(
            callExpression(identifier('require'), [
              memberExpression(
                identifier('Packages'),
                '.',
                identifier('LuauPolyfill')
              ),
            ])
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Number'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Number')
            )
          ),
        ]
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('MAX_VALUE')
            ),
            []
          ),
          'ROBLOX CHECK: Number.MAX_VALUE is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('MIN_VALUE')
            ),
            []
          ),
          'ROBLOX CHECK: Number.MIN_VALUE is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(identifier('Number'), '.', identifier('NaN')),
            []
          ),
          'ROBLOX CHECK: Number.NaN is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('NEGATIVE_INFINITY')
            ),
            []
          ),
          'ROBLOX CHECK: Number.NEGATIVE_INFINITY is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('POSITIVE_INFINITY')
            ),
            []
          ),
          'ROBLOX CHECK: Number.POSITIVE_INFINITY is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('MAX_SAFE_INTEGER')
            ),
            []
          ),
          'ROBLOX CHECK: Number.MAX_SAFE_INTEGER is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(
              identifier('Number'),
              '.',
              identifier('MIN_SAFE_INTEGER')
            ),
            []
          ),
          'ROBLOX CHECK: Number.MIN_SAFE_INTEGER is currently not a JS function. Please verify the conversion output'
        )
      ),
      expressionStatement(
        withTrailingConversionComment(
          callExpression(
            memberExpression(identifier('Number'), '.', identifier('EPSILON')),
            []
          ),
          'ROBLOX CHECK: Number.EPSILON is currently not a JS function. Please verify the conversion output'
        )
      ),
    ]);

    const actual = convertProgram(source, {}, given);
    expect(JSON.stringify(actual, undefined, 2)).toEqual(
      JSON.stringify(expected, undefined, 2)
    );
  });
});
