import {
  Expression,
  isBooleanLiteral,
  isNumericLiteral,
  isStringLiteral,
  TSLiteralType,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  literalType,
  LuaExpression,
  LuaLiteralType,
  typeNumber,
  unhandledTypeAnnotation,
} from '@js-to-lua/lua-types';

export const createTsLiteralTypeHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) => {
  const handleTsTypeLiteral: BaseNodeHandler<LuaLiteralType, TSLiteralType> =
    createHandler('TSLiteralType', (source, config, node) => {
      if (isStringLiteral(node.literal) || isBooleanLiteral(node.literal)) {
        return literalType(
          expressionHandlerFunction(source, config, node.literal)
        );
      } else if (isNumericLiteral(node.literal)) {
        return typeNumber();
      }
      return unhandledTypeAnnotation();
    });

  return handleTsTypeLiteral;
};
