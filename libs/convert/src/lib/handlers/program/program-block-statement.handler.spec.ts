import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  booleanLiteral,
  identifier,
  numericLiteral,
  program,
  stringLiteral,
  tableConstructor,
  tableNoKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from './program.spec.utils';
import { handleProgram } from './program.handler';

const source = '';

describe('Program handler', () => {
  describe('Block Statement', () => {
    it('should handle empty block statement', () => {
      const given = getProgramNode(`
      {
      }
    `);
      const expected = program([blockStatement([])]);

      const luaProgram = handleProgram.handler(source, {}, given);

      expect(luaProgram).toEqual(expected);
    });
  });

  it('should handle simple block statements', () => {
    const given = getProgramNode(`
    {
      const name = "wole";
      let arr = [1,2, true];
    }
  `);

    const expected = program([
      blockStatement([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('name'))],
          [variableDeclaratorValue(stringLiteral('wole'))]
        ),
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('arr'))],
          [
            variableDeclaratorValue(
              tableConstructor([
                tableNoKeyField(numericLiteral(1, '1')),
                tableNoKeyField(numericLiteral(2, '2')),
                tableNoKeyField(booleanLiteral(true)),
              ])
            ),
          ]
        ),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle nested blocks', () => {
    const given = getProgramNode(`
    {
      const name = "wole";
      {
        foo = "roblox"
        foo = 1
      }
    }
  `);
    const expected = program([
      blockStatement([
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
            [numericLiteral(1, '1')]
          ),
        ]),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });

  it('should handle deeply nested blocks', () => {
    const given = getProgramNode(`
    {
      const name = "wole";
      {
        foo = "roblox"
        foo = 1
        {
          foo = "roblox"
        }
      }
    }
  `);
    const expected = program([
      blockStatement([
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
            [numericLiteral(1, '1')]
          ),
          blockStatement([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [stringLiteral('roblox')]
            ),
          ]),
        ]),
      ]),
    ]);

    const luaProgram = handleProgram.handler(source, {}, given);

    expect(luaProgram).toEqual(expected);
  });
});
