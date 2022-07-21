import { isTypeReference, LuaNode, LuaType } from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type VoidTypePolyfillExtra = {
  voidTypePolyfill: true;
};

export const withVoidTypePolyfillExtra = <N extends LuaNode>(node: N) =>
  withExtras<VoidTypePolyfillExtra, N>({
    voidTypePolyfill: true,
  })(node);

export const hasVoidTypePolyfillExtra = <N extends LuaNode>(
  node: N
): node is WithExtras<N, VoidTypePolyfillExtra> =>
  !!node.extras?.voidTypePolyfill;

export const hasVoid = (type?: LuaType) => {
  return (
    type &&
    isTypeReference(type) &&
    type.typeName.name === 'void' &&
    hasVoidTypePolyfillExtra(type)
  );
};
