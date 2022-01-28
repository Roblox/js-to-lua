import { arrayConcat, arrayMethod } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
  numericLiteral,
  tableConstructor,
  tableNoKeyField,
} from '@js-to-lua/lua-types';

export const insertSingleElement = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) =>
  callExpression(
    memberExpression(identifier('table'), '.', identifier('insert')),
    [calleeObject, args[0]]
  );

export const insertMultipleElements = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) =>
  concatArrays(
    calleeObject,
    tableConstructor(args.map((arg) => tableNoKeyField(arg)))
  );

export const concatArrays = (
  calleeObject: LuaExpression,
  ...args: LuaExpression[]
) => callExpression(arrayConcat(), [calleeObject, ...args]);

export const unshiftSingleElement = (
  calleeObject: LuaExpression,
  arg: LuaExpression
) =>
  callExpression(
    memberExpression(identifier('table'), '.', identifier('insert')),
    [calleeObject, numericLiteral(1), arg]
  );

export const unshiftMultipleElements = (
  calleeObject: LuaExpression,
  args: LuaExpression[]
) => callExpression(arrayMethod('unshift'), [calleeObject, ...args]);

export const tableUnpackCall = (arg: LuaExpression) =>
  callExpression(tableUnpack(), [arg]);

export const tableUnpack = () =>
  memberExpression(identifier('table'), '.', identifier('unpack'));
