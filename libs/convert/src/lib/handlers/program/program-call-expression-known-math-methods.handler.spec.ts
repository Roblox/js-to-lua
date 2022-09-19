import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaProgram,
  memberExpression,
  numericLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from './program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from './program.spec.utils';

const source = '';

describe('Known Math methods', () => {
  it('should convert JS Math methods that have Lua equivalents', () => {
    const given = getProgramNode(`
      const ceil = Math.ceil(10.5);
      const abs = Math.abs(3.143);
      const min = Math.min(10,34,12);
    `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('ceil'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('math'), '.', identifier('ceil')),
              [numericLiteral(10.5, '10.5')]
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('abs'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('math'), '.', identifier('abs')),
              [numericLiteral(3.143, '3.143')]
            )
          ),
        ]
      ),
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('min'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('math'), '.', identifier('min')),
              [
                numericLiteral(10, '10'),
                numericLiteral(34, '34'),
                numericLiteral(12, '12'),
              ]
            )
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Math methods that have Polyfills', () => {
    const given = getProgramNode(`
      const clz32 = Math.clz32(128);
    `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('clz32'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('bit32'), '.', identifier('countlz')),
              [numericLiteral(128, '128')]
            )
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it('should convert JS Math methods that do NOT have Polyfills', () => {
    const given = getProgramNode(`
      const trunc = Math.trunc(1.23)
    `);

    const expected: LuaProgram = programWithUpstreamComment([
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
        [variableDeclaratorIdentifier(identifier('Math'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Math')
            )
          ),
        ]
      ),

      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('trunc'))],
        [
          variableDeclaratorValue(
            withTrailingConversionComment(
              callExpression(
                memberExpression(identifier('Math'), '.', identifier('trunc')),
                [numericLiteral(1.23, '1.23')]
              ),
              'ROBLOX NOTE: Math.trunc is currently not supported by the lua Math polyfill, please add your own implementation or file a ticket on the same'
            )
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
  it('should convert JS Math methods that DO NOT exist on the JS Math Object assuming they have been shadowed/implemented', () => {
    const given = getProgramNode(`
    const foo = Math.foo(456)
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('foo'))],
        [
          variableDeclaratorValue(
            callExpression(
              memberExpression(identifier('Math'), ':', identifier('foo')),
              [numericLiteral(456, '456')]
            )
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
  it('should convert JS Math static properties that have Lua equivalents', () => {
    const given = getProgramNode(`
      const pi = Math.PI;
    `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('pi'))],
        [
          variableDeclaratorValue(
            memberExpression(identifier('math'), '.', identifier('pi'))
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  // We currently don't have any polyfilled properties - we'll add this test once we do
  it.todo('should convert JS Math static properties that have Polyfills');

  it('should convert JS Math constants', () => {
    const given = getProgramNode(`
    const eulersConstant = Math.E
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('Math_E'))],
        [variableDeclaratorValue(numericLiteral(2.718281828459045))]
      ),

      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('eulersConstant'))],
        [variableDeclaratorValue(identifier('Math_E'))]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
  it('should convert JS Math properties that DO NOT exist on the JS Math Object assuming they have been shadowed/implemented', () => {
    const given = getProgramNode(`
    const bar = Math.bar
  `);

    const expected: LuaProgram = programWithUpstreamComment([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('bar'))],
        [
          variableDeclaratorValue(
            memberExpression(identifier('Math'), '.', identifier('bar'))
          ),
        ]
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});
