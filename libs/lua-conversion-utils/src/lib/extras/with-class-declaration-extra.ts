import { isNodeGroup, LuaNode, LuaNodeGroup } from '@js-to-lua/lua-types';
import {
  createWithSourceTypeExtra,
  hasSourceTypeExtra,
} from './with-source-type-extra';

const classDeclarationSourceType = 'ClassDeclaration';

export const withClassDeclarationExtra = createWithSourceTypeExtra(
  classDeclarationSourceType
);

export const isClassDeclaration = (node: LuaNode): node is LuaNodeGroup =>
  isNodeGroup(node) && hasSourceTypeExtra(classDeclarationSourceType, node);
