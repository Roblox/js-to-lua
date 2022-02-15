import {
  Expression,
  isLiteral,
  isTemplateLiteral,
  UnaryExpression,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  bit32Identifier,
  defaultStatementHandler,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  memberExpression,
  nilLiteral,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { createExpressionAsBooleanHandler } from '../handle-as-boolean';

export const createUnaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaCallExpression
  | UnhandledStatement,
  UnaryExpression
> =>
  createHandler('UnaryExpression', (source, config, node: UnaryExpression) => {
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
        return assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [handleExpression(source, config, node.argument)],
          [nilLiteral()]
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
        return defaultStatementHandler(source, config, node);
    }

    function handleUnaryNegationExpression(
      source: string,
      node: UnaryExpression
    ) {
      return unaryNegationExpression(
        expressionAsBooleanHandler(source, config, node.argument)
      );
    }

    function handleUnaryVoidExpression(source: string, node: UnaryExpression) {
      return isLiteral(node.argument) && !isTemplateLiteral(node.argument)
        ? identifier('nil')
        : unaryVoidExpression(handleExpression(source, config, node.argument));
    }
  });
