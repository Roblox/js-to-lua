import { continueStatement as babelContinueStatement } from '@babel/types';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  continueStatement,
  identifier,
  nodeGroup,
  numericLiteral,
} from '@js-to-lua/lua-types';
import { createContinueStatementHandler } from './continue-statement.handler';

describe('Continue Statement Handler', () => {
  const continueStatementHandler = createContinueStatementHandler().handler;
  const source = '';

  it(`should handle continue statement`, () => {
    const given = babelContinueStatement();
    const expected = continueStatement();

    expect(continueStatementHandler(source, {}, given)).toEqual(expected);
  });

  it(`should handle continue statement with empty array for continueUpdateStatements config`, () => {
    const given = babelContinueStatement();
    const expected = continueStatement();

    expect(
      continueStatementHandler(
        source,
        {
          continueUpdateStatements: [],
        },
        given
      )
    ).toEqual(expected);
  });

  it(`should handle continue statement with non empty array for continueUpdateStatements config`, () => {
    const given = babelContinueStatement();
    const expected = nodeGroup([
      assignmentStatement(
        AssignmentStatementOperatorEnum.ADD,
        [identifier('foo')],
        [numericLiteral(2)]
      ),
      continueStatement(),
    ]);

    expect(
      continueStatementHandler(
        source,
        {
          continueUpdateStatements: [
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [identifier('foo')],
              [numericLiteral(2)]
            ),
          ],
        },
        given
      )
    ).toEqual(expected);
  });
});
