import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

const tableMethods = ['pack', 'unpack', 'insert'] as const;

export type TableMethod = typeof tableMethods[number];

export const tableUnpackCall = (...args: LuaExpression[]) =>
  tableMethodCall('unpack', ...args);

export const tablePackCall = (...args: LuaExpression[]) =>
  tableMethodCall('pack', ...args);

export const tableInsertCall = (...args: LuaExpression[]) =>
  tableMethodCall('insert', ...args);

export const tableUnpack = () => tableMethod('unpack');

export const tablePack = () => tableMethod('pack');

export const tableInsert = () => tableMethod('insert');

export const tableIdentifier = () => identifier('table');

export const tableMethodIdentifier = (name: TableMethod) => identifier(name);

export const tableMethod = (name: TableMethod) =>
  memberExpression(tableIdentifier(), '.', tableMethodIdentifier(name));

export const tableMethodCall = (name: TableMethod, ...args: LuaExpression[]) =>
  callExpression(tableMethod(name), args);
