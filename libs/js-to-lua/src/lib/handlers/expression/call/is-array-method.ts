import {
  CallExpression,
  Expression,
  Identifier,
  isIdentifier as isBabelIdentifier,
  isMemberExpression,
  MemberExpression,
  V8IntrinsicIdentifier,
} from '@babel/types';
import {
  ArrayPolyfilledMethodName,
  arrayPolyfilledMethodNames,
} from '@js-to-lua/lua-conversion-utils';

type ArrayMethod = keyof [] | 'from';

export const isArrayMethodCall = (
  methodName: ArrayMethod,
  expression: CallExpression
): expression is CallExpression & {
  callee: {
    property: Identifier;
  };
} => isArrayMethod(methodName, expression.callee);

export const isArrayMethod = (
  methodName: ArrayMethod,
  callee: Expression | V8IntrinsicIdentifier
): callee is MemberExpression & {
  property: Identifier;
} =>
  isMemberExpression(callee) &&
  !callee.computed &&
  isBabelIdentifier(callee.property) &&
  callee.property.name === methodName;

export const isAnyPolyfilledArrayMethodCall = (
  expression: CallExpression
): expression is CallExpression & {
  callee: {
    property: Identifier & { name: ArrayPolyfilledMethodName };
  };
} => isAnyPolyfilledMethod(expression.callee);

export const isAnyPolyfilledMethod = (
  callee: Expression | V8IntrinsicIdentifier
): callee is MemberExpression & {
  property: Identifier & { name: ArrayPolyfilledMethodName };
} =>
  arrayPolyfilledMethodNames.some((methodName) =>
    isArrayMethod(methodName, callee)
  );
