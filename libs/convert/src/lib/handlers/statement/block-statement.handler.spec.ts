import {
  assignmentExpression,
  blockStatement as babelBlockStatement,
  BlockStatement,
  expressionStatement,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  identifier,
  LuaBlockStatement,
  numericLiteral,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleStatement } from '../expression-statement.handler';

const source = '';

describe('Block Statement Handler', () => {
  it(`should return Empty Lua Block Node with empty body`, () => {
    const given = babelBlockStatement([]);
    const expected = blockStatement([]);

    expect(handleStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should return Lua Block Constructor Node with expressions`, () => {
    const given: BlockStatement = babelBlockStatement([
      expressionStatement(
        assignmentExpression(
          '=',
          babelIdentifier('foo'),
          babelStringLiteral('hello')
        )
      ),
      expressionStatement(
        assignmentExpression(
          '=',
          babelIdentifier('foo'),
          babelNumericLiteral(1)
        )
      ),
    ]);
    const expected: LuaBlockStatement = blockStatement([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [stringLiteral('hello')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [numericLiteral(1)]
      ),
    ]);

    expect(handleStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle nested block statements`, () => {
    const given = babelBlockStatement([
      babelVariableDeclaration('let', [
        babelVariableDeclarator(
          babelIdentifier('name'),
          babelStringLiteral('wole')
        ),
      ]),
      babelBlockStatement([
        expressionStatement(
          assignmentExpression(
            '=',
            babelIdentifier('foo'),
            babelStringLiteral('roblox')
          )
        ),
        expressionStatement(
          assignmentExpression(
            '=',
            babelIdentifier('foo'),
            babelNumericLiteral(1)
          )
        ),
      ]),
    ]);

    const expected = blockStatement([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('name'))],
        [variableDeclaratorValue(stringLiteral('wole'))]
      ),
      blockStatement([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('roblox')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(1)]
        ),
      ]),
    ]);

    expect(handleStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle deeply nested block statements`, () => {
    const given = babelBlockStatement([
      babelVariableDeclaration('let', [
        babelVariableDeclarator(
          babelIdentifier('name'),
          babelStringLiteral('wole')
        ),
      ]),
      babelBlockStatement([
        expressionStatement(
          assignmentExpression(
            '=',
            babelIdentifier('foo'),
            babelStringLiteral('roblox')
          )
        ),
        expressionStatement(
          assignmentExpression(
            '=',
            babelIdentifier('foo'),
            babelNumericLiteral(1)
          )
        ),
        babelBlockStatement([
          expressionStatement(
            assignmentExpression(
              '=',
              babelIdentifier('foo'),
              babelStringLiteral('nested roblox')
            )
          ),
        ]),
      ]),
    ]);

    const expected: LuaBlockStatement = blockStatement([
      variableDeclaration(
        [variableDeclaratorIdentifier(identifier('name'))],
        [variableDeclaratorValue(stringLiteral('wole'))]
      ),
      blockStatement([
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [stringLiteral('roblox')]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [identifier('foo')],
          [numericLiteral(1)]
        ),
        blockStatement([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [stringLiteral('nested roblox')]
          ),
        ]),
      ]),
    ]);

    expect(handleStatement.handler(source, {}, given)).toEqual(expected);
  });
});
