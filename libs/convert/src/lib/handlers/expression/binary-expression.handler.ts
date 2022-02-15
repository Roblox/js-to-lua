import {
  BinaryExpression,
  Expression,
  isStringLiteral as isBabelStringLiteral,
  isTemplateLiteral as isBabelTemplateLiteral,
  PrivateName,
} from '@babel/types';
import {
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  arrayIndexOf,
  bit32MethodCall,
  defaultExpressionHandler,
  isStringInferable,
  objectKeys,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaExpression,
  LuaStringLiteral,
  numericLiteral,
} from '@js-to-lua/lua-types';

export const createBinaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<LuaExpression, BinaryExpression>(
    'BinaryExpression',
    (source, config, node) => {
      const handleOperandAsString: HandlerFunction<
        LuaCallExpression | LuaStringLiteral,
        Expression
      > = createHandlerFunction((source, config, node: Expression) => {
        const operandNode = handleExpression(source, config, node);

        if (isStringInferable(operandNode)) {
          return operandNode;
        }
        return callExpression(identifier('tostring'), [operandNode]);
      });

      const handleBinaryAddOperatorAsString = createHandlerFunction(
        (source: string, config, node: BinaryExpression & { operator: '+' }) =>
          binaryExpression(
            // TODO: handle PrivateName
            handleOperandAsString(
              source,
              config,
              node.left as Exclude<typeof node.left, PrivateName>
            ),
            '..',
            handleOperandAsString(source, config, node.right)
          )
      );

      const handleBinaryAddOperator = createHandlerFunction(
        (
          source: string,
          config,
          node: BinaryExpression & { operator: '+' }
        ) => {
          if (
            isBabelStringLiteral(node.left) ||
            isBabelStringLiteral(node.right) ||
            isBabelTemplateLiteral(node.left) ||
            isBabelTemplateLiteral(node.right)
          ) {
            return handleBinaryAddOperatorAsString(source, config, node);
          } else {
            const left = handleExpression(
              source,
              config,
              // TODO: handle PrivateName
              node.left as Exclude<typeof node.left, PrivateName>
            );
            const right = handleExpression(source, config, node.right);

            return isStringInferable(left) || isStringInferable(right)
              ? handleBinaryAddOperatorAsString(source, config, node)
              : binaryExpression(left, node.operator, right);
          }
        }
      );

      switch (node.operator) {
        case '-':
        case '/':
        case '*':
        case '%':
          return binaryExpression(
            handleExpression(source, config, node.left as Expression),
            node.operator,
            handleExpression(source, config, node.right)
          );
        case '**':
          return binaryExpression(
            handleExpression(source, config, node.left as Expression),
            '^',
            handleExpression(source, config, node.right)
          );
        case '==':
          return withTrailingConversionComment(
            binaryExpression(
              handleExpression(source, config, node.left as Expression),
              node.operator,
              handleExpression(source, config, node.right)
            ),
            `ROBLOX CHECK: loose equality used upstream`
          );
        case '>':
        case '<':
        case '>=':
        case '<=':
          return withTrailingConversionComment(
            binaryExpression(
              handleExpression(source, config, node.left as Expression),
              node.operator,
              handleExpression(source, config, node.right)
            ),
            `ROBLOX CHECK: operator '${node.operator}' works only if either both arguments are strings or both are a number`
          );
        case '!=':
          return withTrailingConversionComment(
            binaryExpression(
              handleExpression(source, config, node.left as Expression),
              '~=',
              handleExpression(source, config, node.right)
            ),
            `ROBLOX CHECK: loose inequality used upstream`
          );
        case '===':
          return binaryExpression(
            handleExpression(source, config, node.left as Expression),
            '==',
            handleExpression(source, config, node.right)
          );
        case '!==':
          return binaryExpression(
            handleExpression(source, config, node.left as Expression),
            '~=',
            handleExpression(source, config, node.right)
          );

        case '+':
          return handleBinaryAddOperator(source, config, {
            ...node,
            operator: '+',
          });
        case 'in':
          return binaryExpression(
            callExpression(arrayIndexOf(), [
              callExpression(objectKeys(), [
                handleExpression(source, config, node.right),
              ]),
              handleOperandAsString(source, config, node.left as Expression),
            ]),
            '~=',
            numericLiteral(-1)
          );
        case '&':
          return withTrailingConversionComment(
            bit32MethodCall(
              'band',
              handleExpression(source, config, node.left as Expression),
              handleExpression(source, config, node.right as Expression)
            ),
            'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
          );

        case '|':
          return withTrailingConversionComment(
            bit32MethodCall(
              'bor',
              handleExpression(source, config, node.left as Expression),
              handleExpression(source, config, node.right as Expression)
            ),
            'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
          );
        case '^':
          return withTrailingConversionComment(
            bit32MethodCall(
              'bxor',
              handleExpression(source, config, node.left as Expression),
              handleExpression(source, config, node.right as Expression)
            ),
            'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
          );
        case '>>>':
          return withTrailingConversionComment(
            bit32MethodCall(
              'rshift',
              handleExpression(source, config, node.left as Expression),
              handleExpression(source, config, node.right as Expression)
            ),
            'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
          );
        case '>>':
          return withTrailingConversionComment(
            bit32MethodCall(
              'arshift',
              handleExpression(source, config, node.left as Expression),
              handleExpression(source, config, node.right as Expression)
            ),
            'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
          );
        case '<<':
          return withTrailingConversionComment(
            bit32MethodCall(
              'lshift',
              handleExpression(source, config, node.left as Expression),
              handleExpression(source, config, node.right as Expression)
            ),
            'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
          );
        default:
          return defaultExpressionHandler(source, config, node);
      }
    }
  );
