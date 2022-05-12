import {
  Expression,
  isLiteral,
  isTemplateLiteral,
  UnaryExpression,
} from '@babel/types';
import {
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  createAsStatementHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  bit32Identifier,
  defaultExpressionHandler,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  functionExpression,
  identifier,
  isLuaLVal,
  LuaExpression,
  LuaStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  returnStatement,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
} from '@js-to-lua/lua-types';
import { createExpressionAsBooleanHandler } from '../handle-as-boolean';

export const createUnaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, UnaryExpression>(
    'UnaryExpression',
    (source, config, node): LuaExpression => {
      const expressionAsBooleanHandler =
        createExpressionAsBooleanHandler(handleExpression);
      switch (node.operator) {
        case 'typeof':
          return callExpression(identifier('typeof'), [
            handleExpression(source, config, node.argument),
          ]);
        case '+':
          return callExpression(identifier('tonumber'), [
            handleExpression(source, config, node.argument),
          ]);
        case '-':
          return unaryExpression(
            node.operator,
            handleExpression(source, config, node.argument)
          );
        case 'void':
          return handleUnaryVoidExpression(source, node);
        case '!':
          return handleUnaryNegationExpression(source, node);
        case 'delete':
          return callExpression(
            functionExpression(
              [],
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [handleExpression(source, config, node.argument)],
                  [nilLiteral()]
                ),
                returnStatement(booleanLiteral(true)),
              ])
            ),
            []
          );

        case '~':
          return withTrailingConversionComment(
            callExpression(
              memberExpression(bit32Identifier(), '.', identifier('bnot')),
              [handleExpression(source, config, node.argument)]
            ),
            'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
          );
        default:
          return defaultExpressionHandler(source, config, node);
      }

      function handleUnaryNegationExpression(
        source: string,
        node: UnaryExpression
      ) {
        return unaryNegationExpression(
          expressionAsBooleanHandler(source, config, node.argument)
        );
      }

      function handleUnaryVoidExpression(
        source: string,
        node: UnaryExpression
      ) {
        return isLiteral(node.argument) && !isTemplateLiteral(node.argument)
          ? identifier('nil')
          : unaryVoidExpression(
              handleExpression(source, config, node.argument)
            );
      }
    }
  );

export const createUnaryExpressionAsStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) => {
  const handleUnaryExpression =
    createUnaryExpressionHandler(handleExpression).handler;

  return createAsStatementHandler<LuaStatement, UnaryExpression>(
    'UnaryExpression',
    (source, config, node) => {
      if (node.operator === 'delete') {
        const lVal = handleExpression(source, config, node.argument);
        return isLuaLVal(lVal)
          ? asStatementReturnTypeWithIdentifier(
              [
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [lVal],
                  [nilLiteral()]
                ),
              ],
              [],
              booleanLiteral(true)
            )
          : asStatementReturnTypeInline(
              [],
              defaultExpressionHandler(source, config, node),
              []
            );
      }

      const expression = handleUnaryExpression(source, config, node);
      return asStatementReturnTypeInline([], expression, []);
    }
  );
};
