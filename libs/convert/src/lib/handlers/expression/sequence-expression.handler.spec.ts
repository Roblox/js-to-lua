import {
  assignmentExpression as babelAssignmentExpression,
  binaryExpression as babelBinaryExpression,
  callExpression as babelCallExpression,
  Expression,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  sequenceExpression as babelSequenceExpression,
} from '@babel/types';
import {
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  createAsStatementHandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';

import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  expressionStatement,
  functionExpression,
  identifier,
  nodeGroup,
  numericLiteral,
  returnStatement,
} from '@js-to-lua/lua-types';
import { createSequenceExpressionAsStatementHandler } from './sequence-expression-as-statement.handler';
import { createSequenceExpressionHandler } from './sequence-expression.handler';

const { mockNodeAsStatementWithValueHandler } = testUtils;

describe('Sequence Expression Handler', () => {
  const source = '';

  const expressionAsStatementHandler = jest
    .fn()
    .mockImplementation((source, config, node: Expression) => {
      switch (node) {
        case expression1:
          return returnExpression1;
        case expression2:
          return returnExpression2;
        case expression3:
          return returnExpression3;
        case expression4:
          return returnExpression4;
      }
      return mockNodeAsStatementWithValueHandler(source, config, node);
    });

  const expression1 = babelAssignmentExpression(
    '=',
    babelIdentifier('a'),
    babelNumericLiteral(1)
  );
  const expression2 = babelAssignmentExpression(
    '=',
    babelIdentifier('b'),
    babelBinaryExpression('+', babelIdentifier('a'), babelNumericLiteral(1))
  );
  const expression3 = babelCallExpression(babelIdentifier('bar'), []);
  const expression4 = babelIdentifier('a');

  const returnExpression1 = asStatementReturnTypeWithIdentifier(
    [
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('a')],
        [numericLiteral(1)]
      ),
    ],
    [],
    identifier('a')
  );
  const returnExpression2 = asStatementReturnTypeWithIdentifier(
    [
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [identifier('b')],
        [binaryExpression(identifier('a'), '+', numericLiteral(1))]
      ),
    ],
    [],
    identifier('a')
  );
  const returnExpression3 = asStatementReturnTypeInline(
    [],
    callExpression(identifier('bar'), []),
    []
  );
  const returnExpression4 = asStatementReturnTypeInline(
    [],
    identifier('a'),
    []
  );

  describe('default', () => {
    const handleSequenceExpression = createSequenceExpressionHandler(
      createAsStatementHandlerFunction(expressionAsStatementHandler)
    );

    it('should handle sequence expression with identifier as last expression', () => {
      const given = babelSequenceExpression([
        expression1,
        expression2,
        expression3,
        expression4,
      ]);

      const expected = callExpression(
        functionExpression(
          [],
          nodeGroup([
            ...returnExpression1.preStatements,
            ...returnExpression2.preStatements,
            expressionStatement(returnExpression3.inlineExpression),
            returnStatement(identifier('a')),
          ])
        ),
        []
      );

      expect(handleSequenceExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle sequence expression with call expression as last expression', () => {
      const given = babelSequenceExpression([
        expression1,
        expression2,
        expression3,
      ]);

      const expected = callExpression(
        functionExpression(
          [],
          nodeGroup([
            ...returnExpression1.preStatements,
            ...returnExpression2.preStatements,
            returnStatement(returnExpression3.inlineExpression),
          ])
        ),
        []
      );

      expect(handleSequenceExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });

    it('should handle sequence expression with assignment expression as last expression', () => {
      const given = babelSequenceExpression([
        expression1,
        expression3,
        expression2,
      ]);

      const expected = callExpression(
        functionExpression(
          [],
          nodeGroup([
            ...returnExpression1.preStatements,
            expressionStatement(returnExpression3.inlineExpression),
            ...returnExpression2.preStatements,
            returnStatement(...returnExpression2.identifiers),
          ])
        ),
        []
      );

      expect(handleSequenceExpression.handler(source, {}, given)).toEqual(
        expected
      );
    });
  });

  describe('as statement', () => {
    const handleSequenceExpressionAsStatement =
      createSequenceExpressionAsStatementHandler(
        createAsStatementHandlerFunction(expressionAsStatementHandler)
      );

    it('should handle sequence expression with identifier as last expression', () => {
      const given = babelSequenceExpression([
        expression1,
        expression2,
        expression3,
        expression4,
      ]);

      const expected = asStatementReturnTypeInline(
        [
          ...returnExpression1.preStatements,
          ...returnExpression2.preStatements,
          expressionStatement(returnExpression3.inlineExpression),
        ],
        identifier('a'),
        []
      );

      expect(
        handleSequenceExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it('should handle sequence expression with call as last expression', () => {
      const given = babelSequenceExpression([
        expression1,
        expression2,
        expression3,
      ]);

      const expected = asStatementReturnTypeInline(
        [
          ...returnExpression1.preStatements,
          ...returnExpression2.preStatements,
        ],
        returnExpression3.inlineExpression,
        []
      );

      expect(
        handleSequenceExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });

    it('should handle sequence expression with call as last assignment expression', () => {
      const given = babelSequenceExpression([
        expression1,
        expression3,
        expression2,
      ]);

      const expected = asStatementReturnTypeWithIdentifier(
        [
          ...returnExpression1.preStatements,
          expressionStatement(returnExpression3.inlineExpression),
          ...returnExpression2.preStatements,
        ],
        [],
        ...returnExpression2.identifiers
      );

      expect(
        handleSequenceExpressionAsStatement.handler(source, {}, given)
      ).toEqual(expected);
    });
  });
});
