import { generateUniqueIdentifier } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  elseExpressionClause,
  expressionStatement,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  stringLiteral,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('OptionalCallExpression handler', () => {
    describe('as expression', () => {
      it('should handle simple identifier optional call expression', () => {
        const source = `
          foo = bar?.()
        `;
        const given = getProgramNode(source);
        const expected = programWithUpstreamComment([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [
              ifElseExpression(
                ifExpressionClause(
                  binaryExpression(identifier('bar'), '~=', nilLiteral()),
                  callExpression(identifier('bar'))
                ),
                elseExpressionClause(nilLiteral())
              ),
            ]
          ),
        ]);

        expect(convertProgram('', {}, given)).toEqual(expected);
      });

      it('should handle simple identifier optional call expression with params', () => {
        const source = `
          foo = bar?.(param1,param2,param3)
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [
              ifElseExpression(
                ifExpressionClause(
                  binaryExpression(identifier('bar'), '~=', nilLiteral()),
                  callExpression(identifier('bar'), [
                    identifier('param1'),
                    identifier('param2'),
                    identifier('param3'),
                  ])
                ),
                elseExpressionClause(nilLiteral())
              ),
            ]
          ),
        ]);

        expect(convertProgram('', {}, given)).toEqual(expected);
      });

      it('should handle optional member expression call', () => {
        const source = `
          foo = bar?.fizz()
        `;
        const given = getProgramNode(source);

        const expected = programWithUpstreamComment([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('ref'))],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(
                        callExpression(identifier('typeof'), [
                          identifier('bar'),
                        ]),
                        '==',
                        stringLiteral('table')
                      ),
                      memberExpression(
                        identifier('bar'),
                        '.',
                        identifier('fizz')
                      )
                    ),
                    elseExpressionClause(nilLiteral())
                  )
                ),
              ]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(identifier('ref'), '~=', nilLiteral()),
                    callExpression(identifier('ref'))
                  ),
                  elseExpressionClause(nilLiteral())
                ),
              ]
            ),
          ]),
        ]);

        expect(convertProgram('', {}, given)).toEqual(expected);
      });
    });

    describe('as statement', () => {
      it('should handle simple identifier optional call expression', () => {
        const source = `
          foo?.bar()
        `;
        const given = getProgramNode(source);

        const refId = identifier(generateUniqueIdentifier([], 'ref'));

        const expected = programWithUpstreamComment([
          nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(refId)],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(
                        callExpression(identifier('typeof'), [
                          identifier('foo'),
                        ]),
                        '==',
                        stringLiteral('table')
                      ),
                      memberExpression(
                        identifier('foo'),
                        '.',
                        identifier('bar')
                      )
                    ),
                    elseExpressionClause(nilLiteral())
                  )
                ),
              ]
            ),
            ifStatement(
              ifClause(
                binaryExpression(refId, '~=', nilLiteral()),
                nodeGroup([expressionStatement(callExpression(refId))])
              )
            ),
          ]),
        ]);

        expect(convertProgram('', {}, given)).toEqual(expected);
      });
    });
  });
});
