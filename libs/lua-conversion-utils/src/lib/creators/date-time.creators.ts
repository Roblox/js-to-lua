import {
  callExpression,
  identifier,
  LuaExpression,
  memberExpression,
} from '@js-to-lua/lua-types';

const dateTimeMethods = [
  'now',
  'fromUnixTimestamp',
  'fromUnixTimestampMillis',
  'fromUniversalTime',
  'fromLocalTime',
  'fromIsoDate',
] as const;

export type DateTimeMethod = typeof dateTimeMethods[number];

export const dateTimeIdentifier = () => identifier('DateTime');

export const dateTimeMethodIdentifier = (name: DateTimeMethod) =>
  identifier(name);

export const dateTimeMethod = (name: DateTimeMethod) =>
  memberExpression(dateTimeIdentifier(), '.', dateTimeMethodIdentifier(name));

export const dateTimeMethodCall = (
  name: DateTimeMethod,
  ...args: LuaExpression[]
) => callExpression(dateTimeMethod(name), args);
