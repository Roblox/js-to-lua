import { Expression } from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaExpression } from '@js-to-lua/lua-types';
import { createCallExpressionApplyMethodHandlerFunction } from './call-expression-apply-method.handlers';
import { createCallExpressionCallMethodHandlerFunction } from './call-expression-call-method.handlers';
import { createCallExpressionComputedPropertyHandlerFunction } from './call-expression-computed-property.handler';
import { createCallExpressionDateMethodHandler } from './call-expression-date-method.handler';
import { createCallExpressionDotNotationHandlerFunction } from './call-expression-dot-notation.handler';
import { createCallExpressionParseIntHandler } from './call-expression-parse-int.handler';
import { createCallExpressionToStringMethodHandlerFunction } from './call-expression-to-string-method.handlers';
import { createCallExpressionKnownArrayMethodHandlerFunction } from './know-array-methods/call-expression-known-array-method.handler';

export const createCallExpressionSpecialCasesHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  combineOptionalHandlerFunctions([
    createCallExpressionDotNotationHandlerFunction(handleExpression),
    createCallExpressionKnownArrayMethodHandlerFunction(handleExpression),
    createCallExpressionToStringMethodHandlerFunction(handleExpression),
    createCallExpressionCallMethodHandlerFunction(handleExpression),
    createCallExpressionApplyMethodHandlerFunction(handleExpression),
    createCallExpressionComputedPropertyHandlerFunction(handleExpression),
    createCallExpressionDateMethodHandler(),
    createCallExpressionParseIntHandler(handleExpression),
  ]);
