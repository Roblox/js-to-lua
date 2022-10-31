import {
  isNodeGroup,
  isTypeAliasDeclaration,
  LuaNode,
  LuaNodeGroup,
  LuaStatement,
  LuaTypeAliasDeclaration,
} from '@js-to-lua/lua-types';
import {
  createWithSourceTypeExtra,
  hasSourceTypeExtra,
} from './with-source-type-extra';

const classDeclarationSourceType = 'ClassDeclaration';

export const withClassDeclarationExtra = (
  n: LuaNodeGroup<ClassDeclarationBody>
) => createWithSourceTypeExtra(classDeclarationSourceType)(n);

export const isClassDeclaration = (
  node: LuaNode
): node is LuaNodeGroup<ClassDeclarationBody> =>
  isNodeGroup(node) &&
  hasSourceTypeExtra(classDeclarationSourceType, node) &&
  isClassDeclarationBody(node.body);

export type ClassDeclarationBody = [
  LuaTypeAliasDeclaration,
  LuaNodeGroup<Array<LuaTypeAliasDeclaration>>,
  LuaStatement,
  ...LuaStatement[]
];

const isClassDeclarationBody = (
  body: LuaStatement[]
): body is ClassDeclarationBody =>
  body.length >= 3 &&
  isTypeAliasDeclaration(body[0]) &&
  isNodeGroup(body[1]) &&
  body[1].body.every(isTypeAliasDeclaration);
