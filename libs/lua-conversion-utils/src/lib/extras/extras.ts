import { LuaNode } from '@js-to-lua/lua-types';
import { applyTo, curry, lensPath, set } from 'ramda';

export type WithExtras<N extends LuaNode, E> = N & { extras: E };
export type WithoutExtras<N extends LuaNode> = N & { extras: undefined };

export const withExtras = curry(
  <N extends LuaNode, E>(extras: E, node: N): WithExtras<N, E> => ({
    ...node,
    extras: {
      ...node.extras,
      ...extras,
    },
  })
);

export const removeExtras = <N extends LuaNode>(
  extras: string[],
  node: N | undefined
): WithoutExtras<N> | undefined =>
  !node
    ? node
    : applyTo(
        {
          ...node,
          extras: set(lensPath(extras), undefined, node.extras),
        } as unknown as N,
        (result) =>
          (!result || !result.extras
            ? result
            : Object.keys(result.extras).length
            ? result
            : { ...result, extras: undefined }) as WithoutExtras<N>
      );
