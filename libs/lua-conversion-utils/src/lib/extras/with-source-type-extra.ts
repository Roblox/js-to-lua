import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const createWithSourceTypeExtra =
  (sourceType: string) =>
  <N extends LuaNode>(node: N) =>
    withExtras<{ sourceType: string }, N>({
      sourceType,
    })(node);

export const hasSourceTypeExtra = (sourceType: string, node: LuaNode) =>
  node.extras?.sourceType === sourceType;
