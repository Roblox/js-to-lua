import { BinaryExpression, Expression } from '@babel/types';
import {
  binaryExpression,
  callExpression,
  identifier,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaStringLiteral,
  UnhandledStatement,
  numericLiteral,
  arrayIndexOf,
  objectKeys,
  withConversionComment,
  memberExpression,
  bit32Identifier,
} from '@js-to-lua/lua-types';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { defaultStatementHandler } from '../utils/default-handlers';

type Bit32Method = 'band' | 'bor' | 'bxor' | 'rshift' | 'arshift' | 'lshift';

const bit32MethodCall = (
  methodName: Bit32Method,
  left: LuaExpression,
  right: LuaExpression
) =>
  callExpression(
    memberExpression(bit32Identifier(), '.', identifier(methodName)),
    [left, right]
  );

export const createBinaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
): BaseNodeHandler<
  LuaBinaryExpression | UnhandledStatement,
  BinaryExpression
> =>
  createHandler('BinaryExpression', (source, node) => {
    const handleOperandAsString: HandlerFunction<
      LuaCallExpression | LuaStringLiteral,
      Expression
    > = createHandlerFunction((source, node: Expression) => {
      if (node.type === 'StringLiteral') {
        return handleExpression(source, node);
      }
      return callExpression(identifier('tostring'), [
        handleExpression(source, node),
      ]);
    });

    const handleBinaryAddOperator = createHandlerFunction(
      (source: string, node: BinaryExpression & { operator: '+' }) => {
        if (
          node.left.type === 'StringLiteral' ||
          node.right.type === 'StringLiteral'
        ) {
          return binaryExpression(
            handleOperandAsString(source, node.left as Expression),
            '..',
            handleOperandAsString(source, node.right)
          );
        } else {
          return binaryExpression(
            handleExpression(source, node.left as Expression),
            node.operator,
            handleExpression(source, node.right)
          );
        }
      }
    );

    switch (node.operator) {
      case '-':
      case '/':
      case '*':
      case '%':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          node.operator,
          handleExpression(source, node.right)
        );
      case '**':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          '^',
          handleExpression(source, node.right)
        );
      case '==':
        return withConversionComment(
          binaryExpression(
            handleExpression(source, node.left as Expression),
            node.operator,
            handleExpression(source, node.right)
          ),
          `ROBLOX CHECK: loose equality used upstream`
        );
      case '>':
      case '<':
      case '>=':
      case '<=':
        return withConversionComment(
          binaryExpression(
            handleExpression(source, node.left as Expression),
            node.operator,
            handleExpression(source, node.right)
          ),
          `ROBLOX CHECK: operator '${node.operator}' works only if either both arguments are strings or both are a number`
        );
      case '!=':
        return withConversionComment(
          binaryExpression(
            handleExpression(source, node.left as Expression),
            '~=',
            handleExpression(source, node.right)
          ),
          `ROBLOX CHECK: loose inequality used upstream`
        );
      case '===':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          '==',
          handleExpression(source, node.right)
        );
      case '!==':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          '~=',
          handleExpression(source, node.right)
        );

      case '+':
        return handleBinaryAddOperator(source, { ...node, operator: '+' });
      case 'in':
        return binaryExpression(
          callExpression(arrayIndexOf(), [
            callExpression(objectKeys(), [
              handleExpression(source, node.right),
            ]),
            handleOperandAsString(source, node.left as Expression),
          ]),
          '~=',
          numericLiteral(-1)
        );
      case '&':
        return withConversionComment(
          bit32MethodCall(
            'band',
            handleExpression(source, node.left as Expression),
            handleExpression(source, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
        );

      case '|':
        return withConversionComment(
          bit32MethodCall(
            'bor',
            handleExpression(source, node.left as Expression),
            handleExpression(source, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
        );
      case '^':
        return withConversionComment(
          bit32MethodCall(
            'bxor',
            handleExpression(source, node.left as Expression),
            handleExpression(source, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
        );
      case '>>>':
        return withConversionComment(
          bit32MethodCall(
            'rshift',
            handleExpression(source, node.left as Expression),
            handleExpression(source, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
        );
      case '>>':
        return withConversionComment(
          bit32MethodCall(
            'arshift',
            handleExpression(source, node.left as Expression),
            handleExpression(source, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
        );
      case '<<':
        return withConversionComment(
          bit32MethodCall(
            'lshift',
            handleExpression(source, node.left as Expression),
            handleExpression(source, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
        );
      default:
        return defaultStatementHandler(source, node);
    }
  });
