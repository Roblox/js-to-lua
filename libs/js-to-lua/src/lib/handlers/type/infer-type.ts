import {
  ArrayPattern,
  Expression,
  isArrayExpression,
  isArrayPattern,
  isBooleanLiteral,
  isNumericLiteral,
  isObjectExpression,
  isObjectPattern,
  isStringLiteral,
  ObjectPattern,
} from '@babel/types';
import {
  identifier,
  LuaType,
  typeAny,
  typeBoolean,
  typeNumber,
  typeReference,
  typeString,
} from '@js-to-lua/lua-types';

export const inferType = (
  node: Expression | ArrayPattern | ObjectPattern
): LuaType => {
  if (isStringLiteral(node)) {
    return typeString();
  }
  if (isNumericLiteral(node)) {
    return typeNumber();
  }
  if (isBooleanLiteral(node)) {
    return typeBoolean();
  }
  if (isObjectExpression(node)) {
    return typeReference(identifier('Object'));
  }
  if (isArrayExpression(node)) {
    return typeReference(identifier('Array'), [typeAny()]);
  }
  if (isObjectPattern(node)) {
    return typeReference(identifier('Object'));
  }
  if (isArrayPattern(node)) {
    return typeReference(identifier('Array'), [typeAny()]);
  }
  return typeAny();
};
