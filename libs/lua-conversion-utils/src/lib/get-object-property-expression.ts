import { identifier, LuaExpression, stringLiteral } from '@js-to-lua/lua-types';
import {
  getAlternativeExpressionExtra,
  getOriginalIdentifierNameExtra,
  isWithAlternativeExpressionExtras,
  isWithOriginalIdentifierNameExtras,
} from './extras';
import { isValidIdentifier } from './valid-identifier';

export const getObjectPropertyExpression = (
  expression: LuaExpression
): LuaExpression | undefined => {
  if (isWithAlternativeExpressionExtras(expression)) {
    return getAlternativeExpressionExtra(expression);
  } else if (isWithOriginalIdentifierNameExtras(expression)) {
    const originalIdentifierName = getOriginalIdentifierNameExtra(expression);
    if (isValidIdentifier(originalIdentifierName)) {
      return identifier(originalIdentifierName);
    } else {
      return stringLiteral(originalIdentifierName);
    }
  }
  return undefined;
};
