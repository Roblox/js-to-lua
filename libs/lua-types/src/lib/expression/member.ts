import { LuaExpression } from './expression';
import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaIdentifier } from './identifier';

export interface LuaMemberExpression extends BaseLuaNode {
  type: 'LuaMemberExpression';
  indexer: '.' | ':';
  base: LuaExpression;
  identifier: LuaIdentifier;
}

export const memberExpression = (
  base: LuaMemberExpression['base'],
  indexer: LuaMemberExpression['indexer'],
  identifier: LuaMemberExpression['identifier']
): LuaMemberExpression => ({
  type: 'LuaMemberExpression',
  base,
  indexer,
  identifier,
});

export const isMemberExpression = isNodeType<LuaMemberExpression>(
  'LuaMemberExpression'
);
