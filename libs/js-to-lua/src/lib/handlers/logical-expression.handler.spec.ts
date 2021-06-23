import {
  identifier as babelIdentifier,
  logicalExpression as babelLogicalExpression,
} from '@babel/types';
import {
  booleanMethod,
  callExpression,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
} from '@js-to-lua/lua-types';
import { createLogicalExpressionHandler } from './logical-expression.handler';
import { mockNode, mockNodeHandler } from '../testUtils/mock-node';

const source = '';

describe('Logical Expression Handler', () => {
  it(`should handle || operator`, () => {
    const given = babelLogicalExpression(
      '||',
      babelIdentifier('foo'),
      babelIdentifier('bar')
    );

    const handleLogicalExpression = createLogicalExpressionHandler(
      mockNodeHandler
    );

    const expected = logicalExpression(
      LuaLogicalExpressionOperatorEnum.AND,
      callExpression(booleanMethod('toJSBoolean'), [mockNode()]),
      logicalExpression(
        LuaLogicalExpressionOperatorEnum.OR,
        mockNode(),
        mockNode()
      )
    );

    logicalExpression(
      LuaLogicalExpressionOperatorEnum.OR,
      mockNode(),
      mockNode()
    );

    expect(handleLogicalExpression.handler(source, given)).toEqual(expected);
  });
});
