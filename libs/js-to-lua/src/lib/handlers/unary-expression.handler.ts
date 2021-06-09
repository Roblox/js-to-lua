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
  UnhandledNode,
  unhandledNode,
  bit32Identifier,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, createHandler, HandlerFunction } from '../types';

export const createUnaryExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<
  UnaryExpression,
  | LuaUnaryExpression
  | LuaUnaryVoidExpression
  | LuaUnaryNegationExpression
  | LuaUnaryDeleteExpression
  | LuaCallExpression
  | UnhandledNode
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
        return unhandledNode(source.slice(node.start, node.end));
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
        return booleanLiteral(
          !!arg.value,
          `ROBLOX DEVIATION: coerced from \`${source.slice(
            node.start,
            node.end
          )}\` to preserve JS behavior`
        );
      }
      if (arg.type === 'NilLiteral') {
        return booleanLiteral(
          false,
          `ROBLOX DEVIATION: coerced from \`${source.slice(
            node.start,
            node.end
          )}\` to preserve JS behavior`
        );
      }

      return callExpression(booleanMethod('toJSBoolean'), [arg]);
    }
  });
