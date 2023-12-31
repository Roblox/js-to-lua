import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  identifier,
  numericLiteral,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { printNode } from '../print-node';
import { _printComments } from '../printable-comments';
import { createPrintBlockStatement } from './print-block-statement';

const printBlockStatement = createPrintBlockStatement(
  printNode,
  _printComments
);

describe('Print Block Statement', () => {
  it(`should print Block Statement Node with body`, () => {
    const given = blockStatement([]);
    const expected = dedent`
    do
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print Block Statement Node with expressions`, () => {
    const given = blockStatement([
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [stringLiteral('hello')]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('foo')],
        [numericLiteral(1, '1')]
      ),
    ]);

    const expected = dedent`
    do
      foo = "hello";
      foo = 1;
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print nested block statements`, () => {
    const given = blockStatement([
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
    ]);

    const expected = dedent`
    do
      local name = "wole";
      do
      foo = "roblox";
      foo = 1;
    end
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });

  it(`should print deeply nested block statements`, () => {
    const given = blockStatement([
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
            [numericLiteral(1, '1')]
          ),
        ]),
      ]),
    ]);
    const expected = dedent`
    do
      local name = "wole";
      do
      foo = "roblox";
      foo = 1;
      do
      foo = 1;
    end
    end
    end`;

    expect(printBlockStatement(given)).toEqual(expected);
  });
});
