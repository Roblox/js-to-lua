import { LuaNode } from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type OriginalIdentifierNameExtra = {
  originalIdentifierName: string;
};

export const createWithOriginalIdentifierNameExtras =
  (name: string) =>
  <N extends LuaNode>(node: N) =>
    withExtras<{ originalIdentifierName: string }, N>({
      originalIdentifierName: name,
    })(node);

export const isWithOriginalIdentifierNameExtras = <N extends LuaNode>(
  node: N
): node is N & WithExtras<N, OriginalIdentifierNameExtra> =>
  typeof node.extras?.['originalIdentifierName'] === 'string';

export const getOriginalIdentifierNameExtra = <N extends LuaNode>(
  node: WithExtras<N, OriginalIdentifierNameExtra>
): string => node.extras.originalIdentifierName;
