import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  tableConstructor,
  tableNameKeyField,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

describe('Program handler', () => {
  describe('Sequence Expression Handler', () => {
    it('should handle sequence expression in object prop - with simple expressions', () => {
      const source = `
        const foo = {
          bar: (a = 0, b = a + 1, bar(), a)
        }
      `;
      const given = getProgramNode(source);

      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [numericLiteral(0, '0')]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('b')],
            [binaryExpression(identifier('a'), '+', numericLiteral(1, '1'))]
          ),
          expressionStatement(callExpression(identifier('bar'), [])),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('foo'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('bar'), identifier('a')),
                ])
              ),
            ]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in object prop - with updateExpressions', () => {
      const source = `
        const foo = {
          bar: (a++, b = ++a, a)
        }
      `;
      const given = getProgramNode(source);

      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('b')],
            [identifier('a')]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('foo'))],
            [
              variableDeclaratorValue(
                tableConstructor([
                  tableNameKeyField(identifier('bar'), identifier('a')),
                ])
              ),
            ]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in variable declaration - with simple expressions', () => {
      const source = `
        const foo = (a = 0, b = a + 1, bar(), a)
      `;
      const given = getProgramNode(source);

      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('a')],
            [numericLiteral(0, '0')]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('b')],
            [binaryExpression(identifier('a'), '+', numericLiteral(1, '1'))]
          ),
          expressionStatement(callExpression(identifier('bar'), [])),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('foo'))],
            [variableDeclaratorValue(identifier('a'))]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in variable declaration - with updateExpressions', () => {
      const source = `
        const foo = (a++, b = ++a, a)
      `;
      const given = getProgramNode(source);

      const expected = program([
        nodeGroup([
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.ADD,
            [identifier('a')],
            [numericLiteral(1)]
          ),
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('b')],
            [identifier('a')]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('foo'))],
            [variableDeclaratorValue(identifier('a'))]
          ),
        ]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in arrow function shorthand return syntax - with simple expressions', () => {
      const source = `
        const foo = () => (a = 0, b = a + 1, bar(), a)
      `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('a')],
              [numericLiteral(0, '0')]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [binaryExpression(identifier('a'), '+', numericLiteral(1, '1'))]
            ),
            expressionStatement(callExpression(identifier('bar'), [])),
            returnStatement(identifier('a')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in arrow function shorthand return syntax - with function call as last expressions', () => {
      const source = `
        const foo = () => (a = 0, b = a + 1, bar())
      `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('a')],
              [numericLiteral(0, '0')]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [binaryExpression(identifier('a'), '+', numericLiteral(1, '1'))]
            ),
            returnStatement(callExpression(identifier('bar'), [])),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in arrow function shorthand return syntax - with updateExpressions', () => {
      const source = `
        const foo = () => (a++, b = ++a, a)
      `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [identifier('a')],
              [numericLiteral(1)]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [identifier('a')],
              [numericLiteral(1)]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [identifier('a')]
            ),
            returnStatement(identifier('a')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should not ignore parts of sequence expression which are not valid in Luau', () => {
      const source = `
        const foo = () => (a, b = ++a, a)
      `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Lua doesn't support 'Identifier' as a standalone type`,
              'a, b = ++a, a'
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.ADD,
              [identifier('a')],
              [numericLiteral(1)]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [identifier('a')]
            ),
            returnStatement(identifier('a')),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
