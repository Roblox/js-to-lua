import * as Babel from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import {
  arrayIndexOf,
  bit32MethodCall,
  booleanInferableExpression,
  getNodeSource,
  objectKeys,
  withPolyfillExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  identifier,
  LuaExpression,
  numericLiteral,
  unhandledExpression,
} from '@js-to-lua/lua-types';
import { createBinaryAddOperatorHandlerFunction } from './add-operator.handler';
import { createArithmeticOperatorHandlerFunction } from './arithmetic-operator.handler';
import { createCompareOperatorHandlerFunction } from './compare-operator.handler';
import { createLooseEqualsOperatorHandlerFunction } from './loose-equals-operator.handler';
import { createLooseNotEqualsOperatorHandlerFunction } from './loose-not-equals-operator.handler';
import { createOperandAsStringHandlerFunction } from './operand-as-string.handler';
import { createPowerOperatorHandlerFunction } from './power-operator.handler';
import { createStrictEqualsOperatorHandlerFunction } from './strict-equals-operator.handler';
import { createStrictNotEqualsOperatorHandlerFunction } from './strict-not-equals-operator.handler';

export const createBinaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>
) =>
  createHandler<LuaExpression, Babel.BinaryExpression>(
    'BinaryExpression',
    (source, config, node): LuaExpression => {
      const handleOperandAsString =
        createOperandAsStringHandlerFunction(handleExpression);

      if (Babel.isPrivateName(node.left)) {
        return withTrailingConversionComment(
          unhandledExpression(),
          `ROBLOX TODO: Unhandled node for type: ${node.type} with '${node.left.type}' as left-hand side operand`,
          getNodeSource(source, node)
        );
      }

      switch (node.operator) {
        case '-':
        case '/':
        case '*':
        case '%':
          return createArithmeticOperatorHandlerFunction(handleExpression)(
            source,
            config,
            {
              ...node,
              operator: node.operator,
            }
          );
        case '**':
          return createPowerOperatorHandlerFunction(handleExpression)(
            source,
            config,
            { ...node, operator: node.operator }
          );
        case '==':
          return createLooseEqualsOperatorHandlerFunction(handleExpression)(
            source,
            config,
            {
              ...node,
              operator: node.operator,
            }
          );
        case '>':
        case '<':
        case '>=':
        case '<=':
          return createCompareOperatorHandlerFunction(handleExpression)(
            source,
            config,
            {
              ...node,
              operator: node.operator,
            }
          );
        case '!=':
          return createLooseNotEqualsOperatorHandlerFunction(handleExpression)(
            source,
            config,
            { ...node, operator: node.operator }
          );
        case '===':
          return createStrictEqualsOperatorHandlerFunction(handleExpression)(
            source,
            config,
            { ...node, operator: node.operator }
          );
        case '!==':
          return createStrictNotEqualsOperatorHandlerFunction(handleExpression)(
            source,
            config,
            { ...node, operator: node.operator }
          );
        case '+':
          return createBinaryAddOperatorHandlerFunction(handleExpression)(
            source,
            config,
            {
              ...node,
              operator: node.operator,
            }
          );
        case 'in':
          return binaryExpression(
            callExpression(arrayIndexOf(), [
              callExpression(objectKeys(), [
                handleExpression(source, config, node.right),
              ]),
              handleOperandAsString(source, config, node.left),
            ]),
            '~=',
            numericLiteral(-1)
          );
        case '&':
          return withTrailingConversionComment(
            bit32MethodCall(
              'band',
              handleExpression(source, config, node.left),
              handleExpression(source, config, node.right)
            ),
            'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
          );

        case '|':
          return withTrailingConversionComment(
            bit32MethodCall(
              'bor',
              handleExpression(source, config, node.left),
              handleExpression(source, config, node.right)
            ),
            'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
          );
        case '^':
          return withTrailingConversionComment(
            bit32MethodCall(
              'bxor',
              handleExpression(source, config, node.left),
              handleExpression(source, config, node.right)
            ),
            'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
          );
        case '>>>':
          return withTrailingConversionComment(
            bit32MethodCall(
              'rshift',
              handleExpression(source, config, node.left),
              handleExpression(source, config, node.right)
            ),
            'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
          );
        case '>>':
          return withTrailingConversionComment(
            bit32MethodCall(
              'arshift',
              handleExpression(source, config, node.left),
              handleExpression(source, config, node.right)
            ),
            'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
          );
        case '<<':
          return withTrailingConversionComment(
            bit32MethodCall(
              'lshift',
              handleExpression(source, config, node.left),
              handleExpression(source, config, node.right)
            ),
            'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
          );
        case 'instanceof':
          return booleanInferableExpression(
            withPolyfillExtra<LuaExpression, 'instanceof'>('instanceof')(
              callExpression(identifier('instanceof'), [
                handleExpression(source, config, node.left),
                handleExpression(source, config, node.right),
              ])
            )
          );
        default:
          return withTrailingConversionComment(
            unhandledExpression(),
            `ROBLOX TODO: Unhandled node for type: ${node.type} with '${node.operator}' operator`,
            getNodeSource(source, node)
          );
      }
    }
  );
