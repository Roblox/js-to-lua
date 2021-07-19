import {
  callExpression,
  functionExpression,
  identifier,
  LuaIdentifier,
  nodeGroup,
  returnStatement,
} from '@js-to-lua/lua-types';
import {
  assignmentExpression as babelAssignmentExpression,
  binaryExpression as babelBinaryExpression,
  callExpression as babelCallExpression,
  Identifier,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  sequenceExpression as babelSequenceExpression,
} from '@babel/types';
import {
  mockNodeWithValue,
  mockNodeWithValueHandler,
} from '../../testUtils/mock-node';
import {
  createSequenceExpressionAsStatementHandler,
  createSequenceExpressionHandler,
} from './sequence-expression.handler';
import { combineHandlers } from '../../utils/combine-handlers';
import { createHandler } from '../../types';

describe('Sequence Expression Handler', () => {
  const source = '';

  describe('default', () => {
    const handleSequenceExpression = createSequenceExpressionHandler(
      combineHandlers(
        [
          createHandler<LuaIdentifier, Identifier>(
            'Identifier',
            (source, config, node) => identifier(node.name)
          ),
        ],
        mockNodeWithValueHandler
      ).handler
    );
    it('should handle sequence expression', () => {
      const given = babelSequenceExpression([
        babelAssignmentExpression(
          '=',
          babelIdentifier('a'),
          babelNumericLiteral(1)
        ),
        babelAssignmentExpression(
          '=',
          babelIdentifier('b'),
          babelBinaryExpression(
            '+',
            babelIdentifier('a'),
            babelNumericLiteral(1)
          )
        ),
        babelCallExpression(babelIdentifier('bar'), []),
        babelIdentifier('a'),
      ]);

      const expected = callExpression(
        functionExpression(
          [],
          [
            mockNodeWithValue(
              babelAssignmentExpression(
                '=',
                babelIdentifier('a'),
                babelNumericLiteral(1)
              )
            ),
            mockNodeWithValue(
              babelAssignmentExpression(
                '=',
                babelIdentifier('b'),
                babelBinaryExpression(
                  '+',
                  babelIdentifier('a'),
                  babelNumericLiteral(1)
                )
              )
            ),
            mockNodeWithValue(babelCallExpression(babelIdentifier('bar'), [])),
            returnStatement(identifier('a')),
          ]
        ),
        []
      );

      expect(handleSequenceExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  describe('as statement', () => {
    const handleSequenceExpressionAsStatement = createSequenceExpressionAsStatementHandler(
      mockNodeWithValueHandler
    );
    it('should handle sequence expression', () => {
      const given = babelSequenceExpression([
        babelAssignmentExpression(
          '=',
          babelIdentifier('a'),
          babelNumericLiteral(1)
        ),
        babelAssignmentExpression(
          '=',
          babelIdentifier('b'),
          babelBinaryExpression(
            '+',
            babelIdentifier('a'),
            babelNumericLiteral(1)
          )
        ),
        babelCallExpression(babelIdentifier('bar'), []),
        babelIdentifier('a'),
      ]);

      const expected = nodeGroup([
        mockNodeWithValue(
          babelAssignmentExpression(
            '=',
            babelIdentifier('a'),
            babelNumericLiteral(1)
          )
        ),
        mockNodeWithValue(
          babelAssignmentExpression(
            '=',
            babelIdentifier('b'),
            babelBinaryExpression(
              '+',
              babelIdentifier('a'),
              babelNumericLiteral(1)
            )
          )
        ),
        mockNodeWithValue(babelCallExpression(babelIdentifier('bar'), [])),
        mockNodeWithValue(babelIdentifier('a')),
      ]);

      expect(
        handleSequenceExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });
});
