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
  arrayTypeReference,
  objectTypeReference,
} from '@js-to-lua/lua-conversion-utils';
import {
  LuaType,
  typeAny,
  typeBoolean,
  typeNumber,
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
    return objectTypeReference();
  }
  if (isArrayExpression(node)) {
    return arrayTypeReference();
  }
  if (isObjectPattern(node)) {
    return objectTypeReference();
  }
  if (isArrayPattern(node)) {
    return arrayTypeReference();
  }
  return typeAny();
};
