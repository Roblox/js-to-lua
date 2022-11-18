import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  createOptionalHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  stringInferableExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  indexExpression,
  isIdentifier,
  LuaExpression,
  memberExpression,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { createCallExpressionArgumentsHandler } from '../call-expression-arguments.handler';
import {
  ChalkCallee,
  isChalkCallee,
  isNestedChalkCallee,
  NestedChalkCallee,
} from './chalk.utils';

type ChalkCalleeCallHandlerConfig = EmptyConfig & {
  arguments: LuaExpression[];
};

export const createCallExpressionChalkMethodHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) => {
  const handleChalkCalleeCall: HandlerFunction<
    LuaExpression,
    NestedChalkCallee | ChalkCallee,
    ChalkCalleeCallHandlerConfig
  > = createHandlerFunction<
    LuaExpression,
    NestedChalkCallee | ChalkCallee,
    ChalkCalleeCallHandlerConfig
  >(
    (source, config, callee) => {
      if (Babel.isPrivateName(callee.property)) {
        return withTrailingConversionComment(
          unhandledExpression(),
          `ROBLOX TODO: Unhandled node for type: ${callee.type} with '${callee.property.type}' as property`,
          getNodeSource(source, callee)
        );
      }
      const property = handleExpression(source, config, callee.property);

      const chalkCall = callExpression(
        isIdentifier(property) && !callee.computed
          ? memberExpression(identifier('chalk'), '.', property)
          : indexExpression(identifier('chalk'), property),
        config.arguments
      );

      if (isChalkCallee(callee)) {
        return chalkCall;
      }

      return handleChalkCalleeCall(
        source,
        { ...config, arguments: [chalkCall] },
        callee.object
      );
    },
    { skipComments: true }
  );

  const handleCallExpressionArguments =
    createCallExpressionArgumentsHandler(handleExpression);

  return createOptionalHandlerFunction<LuaExpression, Babel.CallExpression>(
    (source, config, expression) => {
      const { callee } = expression;
      if (isNestedChalkCallee(callee)) {
        const chalkCall = handleChalkCalleeCall(
          source,
          {
            ...config,
            arguments: handleCallExpressionArguments(
              source,
              config,
              expression.arguments
            ),
          },
          callee
        );
        return stringInferableExpression(chalkCall);
      }
    }
  );
};
