import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  callExpression,
  expressionStatement,
  identifier,
  nodeGroup,
  numericLiteral,
  program,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  whileStatement,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';

const source = '';

describe('Program handler', () => {
  describe('For statement handler', () => {
    it('should handle basic for loop', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10; i++) {
          foo(i)
        }
      `);
      const expected = program([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });

    it('should handle for statement with no variable declaration', () => {
      const given = getProgramNode(`
        for (; i < 10; i++) {
          foo(i)
        }
      `);
      const expected = program([
        nodeGroup([
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });

    it('should handle for statement with no test node', () => {
      const given = getProgramNode(`
        for (let i = 0;; i++) {
          foo(i)
        }
      `);
      const expected = program([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(booleanLiteral(true), [
            nodeGroup([
              expressionStatement(
                callExpression(identifier('foo'), [identifier('i')])
              ),
            ]),
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.ADD,
                [identifier('i')],
                [numericLiteral(1)]
              ),
            ]),
          ]),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });

    it('should handle for statement with no update', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10;) {
          foo(i)
        }
      `);
      const expected = program([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });

    it('should handle for statement with no variable declaration, no test case, and no update', () => {
      const given = getProgramNode(`
        for (;;) {
          foo(i)
        }
      `);
      const expected = program([
        nodeGroup([
          whileStatement(booleanLiteral(true), [
            nodeGroup([
              expressionStatement(
                callExpression(identifier('foo'), [identifier('i')])
              ),
            ]),
          ]),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });

    it('should handle for statement with a single statement, not array of statements, for the body', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10; i++) foo(i)
      `);
      const expected = program([
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });
  });
});
