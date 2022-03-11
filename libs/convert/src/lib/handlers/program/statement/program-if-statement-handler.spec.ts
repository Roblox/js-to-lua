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
  program,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('If statement Handler', () => {
  it(`should handle if`, () => {
    const given = getProgramNode(`
        if(foo) {}
      `);

    const expected = program([
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

    handleProgram.handler(source, {}, given);
    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/else`, () => {
    const given = getProgramNode(`
        if(foo) {} else {}
      `);

    const expected = program([
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

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif`, () => {
    const given = getProgramNode(`
        if(foo) {} else if (bar) {}
      `);

    const expected = program([
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

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle if/elseif/else`, () => {
    const given = getProgramNode(`
        if(foo) {} else if (bar) {} else {}
      `);

    const expected = program([
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

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});