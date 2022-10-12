import { identifier, LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';

const numberConsts = ['MAX_VALUE', 'MIN_VALUE', 'EPSILON'] as const;

export type NumberConst = typeof numberConsts[number];

export const isNumberConst = (id: string): id is NumberConst =>
  numberConsts.includes(id as NumberConst);

const numberPrefix = 'numberConst' as const;
type NumberPrefix = typeof numberPrefix;

type NumberConstName<S extends NumberConst> = `${NumberPrefix}.${S}`;

const numberConstName = <S extends NumberConst>(
  numberConstIdentifier: S
): NumberConstName<S> => `${numberPrefix}.${numberConstIdentifier}`;

type NumberConstExtra<S extends NumberConst> = {
  [Property in NumberConstName<S>]: true;
};

const numberConstExtra = <P extends NumberConst>(p: P): NumberConstExtra<P> =>
  ({
    [numberConstName(p)]: true,
  } as NumberConstExtra<P>);

export const withNumberConstExtra = <
  N extends LuaNode,
  P extends NumberConst = NumberConst
>(
  mathConstIdentifier: P
) => withExtras<NumberConstExtra<P>, N>(numberConstExtra(mathConstIdentifier));

export const getNumberConstExtras = (
  extras: Record<string, unknown>
): Array<NumberConst> =>
  Object.keys(extras)
    .filter((key) => key.startsWith(`${numberPrefix}.`))
    .map((key) => key.split('.')[1])
    .filter(isNumberConst)
    .sort();

export const numberConstIdentifier = (name: NumberConst) =>
  identifier(`Number_${name}`);
