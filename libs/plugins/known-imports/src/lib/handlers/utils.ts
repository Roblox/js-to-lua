import { reassignComments } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  isIndexExpression,
  isMemberExpression,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';
import { isExactIdentifier, isExactStringLiteral, RequireCall } from '../utils';

export type RequireCallHandler = {
  test: (requireNode: RequireCall) => boolean;
  value: (requireNode: RequireCall) => LuaExpression;
};

export const changeRequire =
  (modulePath: LuaExpression): RequireCallHandler['value'] =>
  (requireNode) =>
    reassignComments(
      callExpression(identifier('require'), [modulePath]),
      requireNode
    );

export const renameSimpleImport = (
  from: string,
  to: string
): RequireCallHandler => ({
  test: ({ arguments: [arg] }) => {
    return (
      (isIndexExpression(arg) &&
        isExactIdentifier('Packages')(arg.base) &&
        isExactStringLiteral(from)(arg.index)) ||
      (isMemberExpression(arg) &&
        isExactIdentifier('Packages')(arg.base) &&
        isExactIdentifier(from)(arg.identifier))
    );
  },
  value: changeRequire(
    memberExpression(identifier('Packages'), '.', identifier(to))
  ),
});

export const renameNestedImport = (
  from: [string, string],
  to: string,
  { devDependency = false }: { devDependency?: boolean } = {}
): RequireCallHandler => ({
  test: ({ arguments: [arg] }) => {
    return (
      (isMemberExpression(arg) || isIndexExpression(arg)) &&
      (isMemberExpression(arg.base) || isIndexExpression(arg.base)) &&
      isExactIdentifier('Packages')(arg.base.base) &&
      (isMemberExpression(arg.base)
        ? isExactIdentifier(from[0])(arg.base.identifier)
        : isExactStringLiteral(from[0])(arg.base.index)) &&
      (isMemberExpression(arg)
        ? isExactIdentifier(from[1])(arg.identifier)
        : isExactStringLiteral(from[1])(arg.index))
    );
  },
  value: changeRequire(
    memberExpression(
      devDependency
        ? memberExpression(identifier('Packages'), '.', identifier('Dev'))
        : identifier('Packages'),
      '.',
      identifier(to)
    )
  ),
});
