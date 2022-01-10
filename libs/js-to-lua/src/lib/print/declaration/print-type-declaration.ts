import { LuaNode, LuaTypeAliasDeclaration } from '@js-to-lua/lua-types';

export const createPrintTypeAliasDeclaration =
  (printNode: (node: LuaNode) => string) => (node: LuaTypeAliasDeclaration) => {
    const typeParameters =
      node.typeParameters && node.typeParameters.length
        ? `<${node.typeParameters.map(printNode).join(', ')}>`
        : '';

    return `type ${printNode(node.id)}${typeParameters} = ${printNode(
      node.typeAnnotation
    )}`;
  };
