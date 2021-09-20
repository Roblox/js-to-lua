import { LuaNode, withExtras } from '@js-to-lua/lua-types';

export const createWithSourceTypeExtra = (sourceType: string) =>
  withExtras({
    sourceType,
  });

export const hasSourceTypeExtra = (sourceType: string, node: LuaNode) =>
  node.extras?.sourceType === sourceType;
