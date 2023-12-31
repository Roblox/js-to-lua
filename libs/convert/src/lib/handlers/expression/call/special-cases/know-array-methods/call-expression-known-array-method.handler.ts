import {
  CallExpression,
  Expression,
  isMemberExpression as isBabelMemberExpression,
} from '@babel/types';
import {
  combineOptionalHandlerFunctions,
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  arrayInferableExpression,
  getNodeSource,
  isArrayInferable,
  removeExtras,
  WithExtras,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import { LuaCallExpression, LuaExpression } from '@js-to-lua/lua-types';
import { applyTo, pipe } from 'ramda';
import { isArrayNode } from './is-array-node';
import { createArrayPolyfilledMethodCallHandler } from './array-polyfilled-method-call.handler';
import { createArrayPopMethodCallHandler } from './array-pop-method-call.handler';
import { createArrayPushMethodCallHandler } from './array-push-method-call.handler';
import { createArrayShiftMethodCallHandler } from './array-shift-method-call.handler';
import { createArrayUnshiftMethodCallHandler } from './array-unshift-method-call.handler';

export const createCallExpressionKnownArrayMethodHandlerFunction = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<LuaCallExpression, CallExpression>(
    (source, config, expression) => {
      const callee = expression.callee;
      if (!isBabelMemberExpression(callee)) {
        return;
      }
      return applyTo(
        combineOptionalHandlerFunctions([
          createArrayPushMethodCallHandler(handleExpressionFunction),
          createArrayPopMethodCallHandler(handleExpressionFunction),
          createArrayUnshiftMethodCallHandler(handleExpressionFunction),
          createArrayShiftMethodCallHandler(handleExpressionFunction),
          createArrayPolyfilledMethodCallHandler(handleExpressionFunction),
        ])(source, config, { ...expression, callee }),
        pipe(
          (
            result:
              | WithExtras<LuaCallExpression, { target: Expression }>
              | undefined
          ) =>
            !result ||
            isArrayNode(result.extras.target) ||
            isArrayInferable(result.arguments[0])
              ? result
              : withTrailingConversionComment(
                  result,
                  `ROBLOX CHECK: check if '${getNodeSource(
                    source,
                    result.extras.target
                  )}' is an Array`
                ),
          (result) => removeExtras<LuaCallExpression>(['target'], result),
          (result) => (result ? arrayInferableExpression(result) : result)
        )
      );
    }
  );
