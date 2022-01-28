import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const createWithSourceTypeExtra = (sourceType: string) =>
  withExtras({
    sourceType,
  });

export const hasSourceTypeExtra = (sourceType: string, node: LuaNode) =>
  node.extras?.sourceType === sourceType;
