import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  elseClause,
  elseifClause,
  identifier,
  ifClause,
  ifStatement,
  memberExpression,
  nodeGroup,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('If statement Handler', () => {
  it(`should handle if`, () => {
    const given = getProgramNode(`
        if(foo) {}
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
      ifStatement(
        ifClause(
          callExpression(
            memberExpression(
              identifier('Boolean'),
              '.',
              identifier('toJSBoolean')
            ),
            [identifier('foo')]
          ),
          nodeGroup([])
        )
      ),
    ]);

    convertProgram(source, {}, given);
    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/else`, () => {
    const given = getProgramNode(`
        if(foo) {} else {}
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
      ifStatement(
        ifClause(
          callExpression(
            memberExpression(
              identifier('Boolean'),
              '.',
              identifier('toJSBoolean')
            ),
            [identifier('foo')]
          ),
          nodeGroup([])
        ),
        [],
        elseClause(nodeGroup([]))
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif`, () => {
    const given = getProgramNode(`
        if(foo) {} else if (bar) {}
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
      ifStatement(
        ifClause(
          callExpression(
            memberExpression(
              identifier('Boolean'),
              '.',
              identifier('toJSBoolean')
            ),
            [identifier('foo')]
          ),
          nodeGroup([])
        ),
        [
          elseifClause(
            callExpression(
              memberExpression(
                identifier('Boolean'),
                '.',
                identifier('toJSBoolean')
              ),
              [identifier('bar')]
            ),
            nodeGroup([])
          ),
        ]
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif/else`, () => {
    const given = getProgramNode(`
        if(foo) {} else if (bar) {} else {}
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
      ifStatement(
        ifClause(
          callExpression(
            memberExpression(
              identifier('Boolean'),
              '.',
              identifier('toJSBoolean')
            ),
            [identifier('foo')]
          ),
          nodeGroup([])
        ),
        [
          elseifClause(
            callExpression(
              memberExpression(
                identifier('Boolean'),
                '.',
                identifier('toJSBoolean')
              ),
              [identifier('bar')]
            ),
            nodeGroup([])
          ),
        ],
        elseClause(nodeGroup([]))
      ),
    ]);

    expect(convertProgram(source, {}, given)).toEqual(expected);
  });
});
