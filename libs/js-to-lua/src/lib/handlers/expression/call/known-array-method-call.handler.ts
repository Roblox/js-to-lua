import { createOptionalHandlerFunction, HandlerFunction } from '../../../types';
import {
  arrayInferableExpression,
  isArrayInferable,
  LuaCallExpression,
  LuaExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { CallExpression, Expression, MemberExpression } from '@babel/types';
import { createArrayPushMethodCallHandler } from './array-push-method-call.handler';
import { combineOptionalHandlerFunctions } from '../../../utils/combine-optional-handlers';
import { applyTo, pipe } from 'ramda';
import { isArrayNode } from './is-array-node';
import { createArrayPolyfilledMethodCallHandler } from './array-polyfilled-method-call.handler';
import { getNodeSource } from '../../../utils/get-node-source';
import { createArrayPopMethodCallHandler } from './array-pop-method-call.handler';
import { createArrayUnshiftMethodCallHandler } from './array-unshift-method-call.handler';
import { createArrayShiftMethodCallHandler } from './array-shift-method-call.handler';

export const createKnownArrayMethodCallHandler = (
  handleExpressionFunction: HandlerFunction<LuaExpression, Expression>
) =>
  createOptionalHandlerFunction<
    LuaCallExpression,
    Omit<CallExpression, 'callee'> & { callee: MemberExpression }
  >((source, config, expression) =>
    applyTo(
      combineOptionalHandlerFunctions([
        createArrayPushMethodCallHandler(handleExpressionFunction),
        createArrayPopMethodCallHandler(handleExpressionFunction),
        createArrayUnshiftMethodCallHandler(handleExpressionFunction),
        createArrayShiftMethodCallHandler(handleExpressionFunction),
        createArrayPolyfilledMethodCallHandler(handleExpressionFunction),
      ])(source, config, expression),
      pipe(
        (result: LuaCallExpression | undefined) =>
          !result ||
          isArrayNode(expression.callee.object) ||
          isArrayInferable(result.arguments[0])
            ? result
            : withTrailingConversionComment(
                result,
                `ROBLOX CHECK: check if '${getNodeSource(
                  source,
                  expression.callee.object
                )}' is an Array`
              ),
        (result) => (result ? arrayInferableExpression(result) : result)
      )
    )
  );
