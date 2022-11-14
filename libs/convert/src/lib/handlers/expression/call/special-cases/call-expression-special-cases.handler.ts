import { Expression } from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { LuaExpression } from '@js-to-lua/lua-types';
import { createCallExpressionApplyMethodHandlerFunction } from './call-expression-apply-method.handlers';
import { createCallExpressionBindHandlerFunction } from './call-expression-bind.handler';
import { createCallExpressionCallMethodHandlerFunction } from './call-expression-call-method.handlers';
import { createCallExpressionComputedPropertyHandlerFunction } from './call-expression-computed-property.handler';
import { createCallExpressionDateMethodHandler } from './call-expression-date-method.handler';
import { createCallExpressionDotNotationHandlerFunction } from './call-expression-dot-notation.handler';
import { createCallExpressionKnownNumberMethodHandlerFunction } from './call-expression-known-number-methods.handler';
import { createCallExpressionParseIntHandler } from './call-expression-parse-int.handler';
import { createCallExpressionToStringMethodHandlerFunction } from './call-expression-to-string-method.handlers';
import { createCallExpressionKnownArrayMethodHandlerFunction } from './know-array-methods/call-expression-known-array-method.handler';
import { createCallExpressionKnownMathMethodHandlerFunction } from './known-math-methods/call-expression-known-math-methods.handler';

export const createCallExpressionSpecialCasesHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  combineOptionalHandlerFunctions([
    /* DEV NOTE: put new handlers  >> HERE <<
      The optional handlers are executed in order
      so it's safest to add new ones in front
      so that other handlers don't intercept the execution
    */
    // eg. `func.bind(thisArg, p1, p2)` converts to: `function(...) func(thisArg, p1, p2, ...) end`
    createCallExpressionBindHandlerFunction(handleExpression),
    // eg. React.createElement(JSX) or Promise.new() etc.
    createCallExpressionDotNotationHandlerFunction(handleExpression),
    // eg. arr.push(v) or arr['push'](v)
    createCallExpressionKnownArrayMethodHandlerFunction(handleExpression),
    // eg. Math.sin(v) or Math['sin'](v)
    createCallExpressionKnownMathMethodHandlerFunction(handleExpression),
    // eg. Date.now() or Date['now']()
    createCallExpressionDateMethodHandler(),
    // eg. Number.isNaN(v) or Number['isNaN'](v)
    createCallExpressionKnownNumberMethodHandlerFunction(handleExpression),
    // eg. value.toString()
    createCallExpressionToStringMethodHandlerFunction(handleExpression),
    // eg. func.call(thisArg, arg1, arg2)
    createCallExpressionCallMethodHandlerFunction(handleExpression),
    // eg. func.apply(thisArg, [arg1, arg2])
    createCallExpressionApplyMethodHandlerFunction(handleExpression),
    // eg. parsetInt(val)
    createCallExpressionParseIntHandler(handleExpression),
    // eg. `obj['method'](p1, p2)` converts to: `obj["method"](obj, p1, p2)`
    createCallExpressionComputedPropertyHandlerFunction(handleExpression),
  ]);
