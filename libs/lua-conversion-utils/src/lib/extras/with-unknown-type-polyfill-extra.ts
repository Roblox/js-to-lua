import { LuaNode } from '@js-to-lua/lua-types';
import { withExtras } from './extras';

export const withUnknownTypePolyfillExtra = withExtras({
  unknownTypePolyfill: true,
});

export const hasUnknownTypePolyfillExtra = (node: LuaNode) =>
  !!node.extras?.unknownTypePolyfill;
