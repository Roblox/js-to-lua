import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  booleanLiteral,
  breakStatement,
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  nodeGroup,
  repeatStatement,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  whileStatement,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('While statement Handler', () => {
  it(`should handle while`, () => {
    const given = getProgramNode(`
      do {} while(foo)
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
      repeatStatement(
        unaryNegationExpression(
          callExpression(
            memberExpression(
              identifier('Boolean'),
              '.',
              identifier('toJSBoolean')
            ),
            [identifier('foo')]
          )
        ),
        [nodeGroup([])]
      ),
    ]);

    convertProgram(source, {}, given);
    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle while with body`, () => {
    const given = getProgramNode(`
      do {
        bar()
      } while(foo)
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
      repeatStatement(
        unaryNegationExpression(
          callExpression(
            memberExpression(
              identifier('Boolean'),
              '.',
              identifier('toJSBoolean')
            ),
            [identifier('foo')]
          )
        ),
        [
          nodeGroup([
            expressionStatement(callExpression(identifier('bar'), [])),
          ]),
        ]
      ),
    ]);

    convertProgram(source, {}, given);
    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle while with boolean inferrable test`, () => {
    const given = getProgramNode(`
      do {} while(true)
    `);

    const expected = programWithUpstreamComment([
      repeatStatement(unaryNegationExpression(booleanLiteral(true)), [
        nodeGroup([]),
      ]),
    ]);

    convertProgram(source, {}, given);
    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle nested while`, () => {
    const given = getProgramNode(`
      do {
        while(true) {
          break
        }
        break
      } while(true)
    `);

    const expected = programWithUpstreamComment([
      repeatStatement(unaryNegationExpression(booleanLiteral(true)), [
        nodeGroup([
          whileStatement(booleanLiteral(true), [nodeGroup([breakStatement()])]),
          breakStatement(),
        ]),
      ]),
    ]);

    convertProgram(source, {}, given);
    expect(convertProgram(source, {}, given)).toEqual(expected);
  });
});
