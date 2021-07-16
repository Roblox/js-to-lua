import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaIdentifier, LuaStatement } from '../lua-nodes.types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export interface ForGenericStatement extends BaseLuaNode {
  type: 'ForGenericStatement';
  variables: NonEmptyArray<LuaIdentifier>;
  iterators: NonEmptyArray<LuaExpression>;
  body: LuaStatement[];
}

export const forGenericStatement = (
  variables: ForGenericStatement['variables'],
  iterators: ForGenericStatement['iterators'],
  body: ForGenericStatement['body'] = []
): ForGenericStatement => ({
  type: 'ForGenericStatement',
  variables,
  iterators,
  body,
});

export const isForGenericStatement = isNodeType<ForGenericStatement>(
  'ForGenericStatement'
);
