import { isClassDeclaration } from '@js-to-lua/lua-conversion-utils';
import {
  isNodeGroup,
  LuaNode,
  LuaTypeAliasDeclaration,
} from '@js-to-lua/lua-types';
import { applyTo } from 'ramda';

export const createExtractDeclarationMetadata = <
  T extends LuaNode,
  R extends LuaNode
>(
  getDeclarationId: (declaration: T) => Array<R>
) => {
  return function extractDeclarationMetadata(maybeDeclaration: T) {
    let declaration = maybeDeclaration;
    let declarationIds: Array<R>;
    let exportedTypes: LuaTypeAliasDeclaration[] = [];

    if (isClassDeclaration(maybeDeclaration)) {
      const [classType, classVariableDeclaration, ...rest] =
        maybeDeclaration.body;
      exportedTypes = [classType as LuaTypeAliasDeclaration];
      declaration = {
        ...maybeDeclaration,
        body: [classVariableDeclaration, ...rest],
      };
      declarationIds = getDeclarationId(classVariableDeclaration as T);
    } else {
      declarationIds = getDeclarationId(maybeDeclaration);
    }

    const filterDeclarationIds = (d: typeof declaration) => {
      if (isNodeGroup(d)) {
        return d.body.filter(
          (bodyElement) =>
            !(declarationIds as Array<LuaNode>).includes(bodyElement)
        );
      } else {
        return [d].filter(
          (element) => !(declarationIds as Array<LuaNode>).includes(element)
        );
      }
    };

    return {
      exportedTypes,
      declarationIds,
      declarationNotIds: applyTo(declaration, filterDeclarationIds),
    };
  };
};
