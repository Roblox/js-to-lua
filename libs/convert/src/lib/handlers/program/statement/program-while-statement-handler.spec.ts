import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  breakStatement,
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  whileStatement,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('While statement Handler', () => {
  it(`should handle while`, () => {
    const given = getProgramNode(`
      while(foo) {}
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
        [variableDeclaratorIdentifier(identifier('Boolean'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Boolean')
            )
          ),
        ]
      ),
      whileStatement(
        callExpression(
          memberExpression(
            identifier('Boolean'),
            '.',
            identifier('toJSBoolean')
          ),
          [identifier('foo')]
        ),
        [nodeGroup([])]
      ),
    ]);

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle while with body`, () => {
    const given = getProgramNode(`
      while(foo) {
        bar()
      }
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
        [variableDeclaratorIdentifier(identifier('Boolean'))],
        [
          variableDeclaratorValue(
            memberExpression(
              identifier('LuauPolyfill'),
              '.',
              identifier('Boolean')
            )
          ),
        ]
      ),
      whileStatement(
        callExpression(
          memberExpression(
            identifier('Boolean'),
            '.',
            identifier('toJSBoolean')
          ),
          [identifier('foo')]
        ),
        [
          nodeGroup([
            expressionStatement(callExpression(identifier('bar'), [])),
          ]),
        ]
      ),
    ]);

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle while with boolean inferrable test`, () => {
    const given = getProgramNode(`
      while(true) {}
    `);

    const expected = programWithUpstreamComment([
      whileStatement(booleanLiteral(true), [nodeGroup([])]),
    ]);

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle nested while`, () => {
    const given = getProgramNode(`
      while(true) {
        while(true) {
          break
        }
        break
      }
    `);

    const expected = programWithUpstreamComment([
      whileStatement(booleanLiteral(true), [
        nodeGroup([
          whileStatement(booleanLiteral(true), [nodeGroup([breakStatement()])]),
          breakStatement(),
        ]),
      ]),
    ]);

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});
