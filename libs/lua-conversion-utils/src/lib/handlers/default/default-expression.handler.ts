import { Expression } from '@babel/types';
import {
  asStatementReturnTypeInline,
  createAsStatementHandlerFunction,
  createHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  unhandledExpression,
  UnhandledExpression,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { withTrailingConversionComment } from '../../comment';
import { getNodeSource } from '../../get-node-source';

export const defaultExpressionHandler =
  createHandlerFunction<UnhandledExpression>((source, config, node) => {
    return withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

export const defaultExpressionAsStatementHandler =
  createAsStatementHandlerFunction<
    UnhandledStatement,
    Expression,
    UnhandledExpression
  >((source, config, node) => {
    const expression = withTrailingConversionComment(
      unhandledExpression(),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );

    return asStatementReturnTypeInline([], expression, []);
  });
