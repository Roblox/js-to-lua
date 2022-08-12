import * as Babel from '@babel/types';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { Unpacked } from '@js-to-lua/shared-utils';

type BabelClassBodyNode = Unpacked<Babel.ClassBody['body']>;

export const isClassConstructor = (
  node: BabelClassBodyNode
): node is Babel.ClassMethod =>
  Babel.isClassMethod(node) &&
  Babel.isIdentifier(node.key) &&
  node.key.name === 'constructor';

export const isAnyClassProperty = (
  node: BabelClassBodyNode
): node is Babel.ClassProperty | Babel.ClassPrivateProperty =>
  Babel.isClassProperty(node) || Babel.isClassPrivateProperty(node);

export const isAnyClassMethod = (
  node: BabelClassBodyNode
): node is
  | Babel.ClassMethod
  | Babel.ClassPrivateMethod
  | Babel.TSDeclareMethod =>
  Babel.isClassMethod(node) ||
  Babel.isClassPrivateMethod(node) ||
  Babel.isTSDeclareMethod(node);

export const isPublic = (node: {
  accessibility?: 'public' | 'private' | 'protected' | null;
}): boolean => !node.accessibility || node.accessibility === 'public';

export const isPublicClassMethod = (
  node: BabelClassBodyNode
): node is Babel.ClassMethod | Babel.TSDeclareMethod =>
  (Babel.isClassMethod(node) || Babel.isTSDeclareMethod(node)) &&
  isPublic(node);

export const createClassIdentifierStatics = (classIdentifier: LuaIdentifier) =>
  identifier(`${classIdentifier.name}_statics`);
