import { LuaNode } from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type OriginalIdsExtra = {
  originalIds: string[];
};

export const withOriginalIds = <N extends LuaNode>(
  originalIds: string[],
  node: N
) =>
  withExtras<OriginalIdsExtra, N>({
    originalIds,
  })(node);

export const isWithOriginalIds = <N extends LuaNode>(
  node: N
): node is WithExtras<N, OriginalIdsExtra> =>
  Array.isArray(node.extras?.['originalIds']);

export const getOriginalIds = <N extends LuaNode>(
  node: WithExtras<N, OriginalIdsExtra>
): OriginalIdsExtra['originalIds'] => node.extras.originalIds;

export const getOptionalOriginalIds = <N extends LuaNode>(
  node: N
): OriginalIdsExtra['originalIds'] =>
  isWithOriginalIds(node) ? node.extras.originalIds : [];
