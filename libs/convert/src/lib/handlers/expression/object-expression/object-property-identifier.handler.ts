import { Identifier } from '@babel/types';
import { createHandlerFunction } from '@js-to-lua/handler-utils';
import {
  defaultExpressionHandler,
  getObjectPropertyExpression,
} from '@js-to-lua/lua-conversion-utils';
import { isIdentifier, LuaExpression } from '@js-to-lua/lua-types';
import { IdentifierHandlerFunction } from '../identifier-handler-types';

export const createObjectPropertyIdentifierHandler = (
  handleIdentifier: IdentifierHandlerFunction
) => {
  return createHandlerFunction<LuaExpression, Identifier>(
    (source, config, node) => {
      const identifierResult = handleIdentifier(source, config, node);
      const propertyExpression = getObjectPropertyExpression(identifierResult);

      return propertyExpression
        ? propertyExpression
        : isIdentifier(identifierResult)
        ? identifierResult
        : defaultExpressionHandler(source, config, node);
    }
  );
};
