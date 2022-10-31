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

const isObject = (node: unknown): node is Record<string, unknown> =>
  typeof node === 'object' && node !== null;

export const isPublicExplicit = (
  node: unknown
): node is { accessibility?: 'public' } =>
  isObject(node) && node.accessibility === 'public';

export const isPublic = (
  node: unknown
): node is { accessibility?: 'public' | null } =>
  isObject(node) &&
  (node.accessibility === undefined ||
    node.accessibility === null ||
    node.accessibility === 'public');

export const isPrivate = (
  node: unknown
): node is { accessibility: 'private' } =>
  isObject(node) && node.accessibility === 'private';

export const isProtected = (
  node: unknown
): node is { accessibility: 'protected' } =>
  isObject(node) && node.accessibility === 'protected';

export const isClassMethod = (
  node: BabelClassBodyNode
): node is Babel.ClassMethod | Babel.TSDeclareMethod =>
  Babel.isClassMethod(node) || Babel.isTSDeclareMethod(node);

export const createClassIdentifierPrivate = (classIdentifier: LuaIdentifier) =>
  identifier(`${classIdentifier.name}_private`);

export const createClassIdentifierStatics = (classIdentifier: LuaIdentifier) =>
  identifier(`${classIdentifier.name}_statics`);

export const hasPrivateMembers = (node: Babel.ClassDeclaration): boolean => {
  const constructorMethod = node.body.body.find(isClassConstructor);

  const hasPrivateConstructorParam = !!(
    constructorMethod &&
    constructorMethod.params.find((p) => 'accessibility' in p && isPrivate(p))
  );
  const hasPrivateMember = !!node.body.body.find(
    (p) => 'accessibility' in p && isPrivate(p)
  );

  return hasPrivateConstructorParam || hasPrivateMember;
};

export const hasProtectedMembers = (node: Babel.ClassDeclaration): boolean => {
  const constructorMethod = node.body.body.find(isClassConstructor);

  const hasPrivateConstructorParam = !!(
    constructorMethod &&
    constructorMethod.params.find((p) => 'accessibility' in p && isProtected(p))
  );
  const hasPrivateMember = !!node.body.body.find(
    (p) => 'accessibility' in p && isProtected(p)
  );

  return hasPrivateConstructorParam || hasPrivateMember;
};

export const hasNonPublicMembers = (node: Babel.ClassDeclaration): boolean =>
  hasPrivateMembers(node) || hasProtectedMembers(node);

export const groupProperties = <
  P extends Babel.TSParameterProperty | BabelClassMethodOrProperty
>(
  properties: P[]
) => ({
  public: properties.filter(isPublic),
  publicExplicit: properties.filter(isPublicExplicit),
  protected: properties.filter(isProtected),
  private: properties.filter(isPrivate),
});

export const getConstructorTsParameters = (
  node: Babel.ClassDeclaration
): Babel.TSParameterProperty[] => {
  const constructorMethod = node.body.body.find(isClassConstructor);

  return (
    (constructorMethod &&
      constructorMethod.params.filter((n): n is Babel.TSParameterProperty =>
        Babel.isTSParameterProperty(n)
      )) ||
    []
  );
};

type BabelClassMethodOrProperty =
  | Babel.ClassMethod
  | Babel.TSDeclareMethod
  | Babel.ClassProperty;

export const getMethodsAndProperties = (
  node: Babel.ClassDeclaration
): Array<BabelClassMethodOrProperty> => {
  const bodyWithoutConstructor = node.body.body.filter(
    (n) => !isClassConstructor(n)
  );

  return bodyWithoutConstructor.filter(
    (n): n is BabelClassMethodOrProperty =>
      (isClassMethod(n) || Babel.isClassProperty(n)) && !n.static
  );
};

export const isReactComponentExtendedClass = (
  node: Babel.ClassDeclaration
): node is Omit<Babel.ClassDeclaration, 'superClass'> & {
  superClass: Babel.MemberExpression;
} =>
  !!node.superClass &&
  Babel.isMemberExpression(node.superClass) &&
  Babel.isIdentifier(node.superClass.object) &&
  node.superClass.object.name === 'React' &&
  Babel.isIdentifier(node.superClass.property) &&
  ['Component', 'PureComponent'].includes(node.superClass.property.name);
