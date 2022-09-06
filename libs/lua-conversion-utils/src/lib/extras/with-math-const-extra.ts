import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';

const mathConsts = [
  'E',
  'LN2',
  'LN10',
  'LOG2E',
  'LOG10E',
  'SQRT1_2',
  'SQRT2',
] as const;

export type MathConst = typeof mathConsts[number];

export const isMathConst = (
  id: string,
  validConsts: MathConst[]
): id is MathConst => validConsts.includes(id as MathConst);

type MathConstName<S extends string> = `mathConst.${S}`;

type MathExtra<S extends string> = {
  [Property in MathConstName<S>]: true;
} & {
  needsMathExtra: true;
};

const mathExtra = <P extends MathConst>(p: P): MathExtra<P> =>
  ({
    needsMathExtra: true,
    [`mathConst.${p}`]: true,
  } as MathExtra<P>);

export const withMathExtra = <
  N extends LuaNode,
  P extends MathConst = MathConst
>(
  mathConstIdentifier: P
) => withExtras<MathExtra<P>, N>(mathExtra(mathConstIdentifier));

export const hasMathExtra = (mathConstIdentifier: MathConst, node: LuaNode) =>
  node.extras?.[`mathConst.${mathConstIdentifier}`] === true;
