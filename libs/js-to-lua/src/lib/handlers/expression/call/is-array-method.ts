import {
  CallExpression,
  Identifier,
  isIdentifier as isBabelIdentifier,
  isMemberExpression,
} from '@babel/types';
import {
  ArrayPolyfilledMethodName,
  arrayPolyfilledMethodNames,
} from '@js-to-lua/lua-types';

type ArrayMethod = keyof [] | 'from';

export const isArrayMethod = (
  methodName: ArrayMethod,
  expression: CallExpression
): expression is CallExpression & {
  callee: {
    property: Identifier;
  };
} =>
  isMemberExpression(expression.callee) &&
  !expression.callee.computed &&
  isBabelIdentifier(expression.callee.property) &&
  expression.callee.property.name === methodName;

export const isAnyPolyfilledArrayMethod = (
  expression: CallExpression
): expression is CallExpression & {
  callee: {
    property: Identifier & { name: ArrayPolyfilledMethodName };
  };
} =>
  arrayPolyfilledMethodNames.some((methodName) =>
    isArrayMethod(methodName, expression)
  );
