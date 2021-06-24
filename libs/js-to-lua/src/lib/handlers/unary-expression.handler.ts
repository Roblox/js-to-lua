import { Expression, UnaryExpression } from '@babel/types';
import {
  booleanLiteral,
  booleanMethod,
  callExpression,
  identifier,
  memberExpression,
  LuaCallExpression,
  LuaExpression,
  LuaMultilineStringLiteral,
  LuaNode,
  LuaNumericLiteral,
  LuaStringLiteral,
  LuaUnaryDeleteExpression,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  unaryDeleteExpression,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
  UnhandledStatement,
  bit32Identifier,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';
import { defaultStatementHandler } from '../utils/default-handlers';

export const createUnaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaUnaryDeleteExpression
  | LuaCallExpression
  | UnhandledStatement,
  UnaryExpression
> =>
  createHandler('UnaryExpression', (source, node: UnaryExpression) => {
    switch (node.operator) {
      case 'typeof':
        return callExpression(identifier('typeof'), [
          handleExpression(source, node.argument),
        ]);
      case '+':
        return callExpression(identifier('tonumber'), [
          handleExpression(source, node.argument),
        ]);
      case '-':
        return unaryExpression(
          node.operator,
          handleExpression(source, node.argument)
        );
      case 'void':
        return unaryVoidExpression(handleExpression(source, node.argument));
      case '!':
        return handleUnaryNegationExpression(source, node);
      case 'delete':
        return unaryDeleteExpression(handleExpression(source, node.argument));
      case '~':
        return withConversionComment(
          callExpression(
            memberExpression(bit32Identifier(), '.', identifier('bnot')),
            [handleExpression(source, node.argument)]
          ),
          'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
        );
      default:
        return defaultStatementHandler(source, node);
    }

    function handleUnaryNegationExpression(
      source: string,
      node: UnaryExpression
    ) {
      return unaryNegationExpression(
        handleUnaryNegationExpressionArgument(source, node.argument)
      );
    }

    function handleUnaryNegationExpressionArgument(
      source: string,
      node: Expression
    ) {
      const LITERALS = [
        'StringLiteral',
        'NumericLiteral',
        'MultilineStringLiteral',
      ];
      const isLiteral = (
        node: LuaNode
      ): node is
        | LuaStringLiteral
        | LuaNumericLiteral
        | LuaMultilineStringLiteral => LITERALS.includes(node.type);
      const arg = handleExpression(source, node);

      if (arg.type === 'BooleanLiteral') {
        return arg;
      }

      if (isLiteral(arg)) {
        return withConversionComment(
          booleanLiteral(!!arg.value),
          `ROBLOX DEVIATION: coerced from \`${source.slice(
            node.start,
            node.end
          )}\` to preserve JS behavior`
        );
      }
      if (arg.type === 'NilLiteral') {
        return withConversionComment(
          booleanLiteral(false),
          `ROBLOX DEVIATION: coerced from \`${source.slice(
            node.start,
            node.end
          )}\` to preserve JS behavior`
        );
      }

      return callExpression(booleanMethod('toJSBoolean'), [arg]);
    }
  });
