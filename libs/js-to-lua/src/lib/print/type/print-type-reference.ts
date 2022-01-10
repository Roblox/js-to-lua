import { LuaNode, LuaTypeReference } from '@js-to-lua/lua-types';

export const createPrintTypeReference =
  (printNode: (node: LuaNode) => string) =>
  (node: LuaTypeReference): string => {
    const genericTypeParameters = node.typeParameters
      ? `<${node.typeParameters.map(printNode).join(', ')}>`
      : '';

    return `${printNode(node.typeName)}${genericTypeParameters}`;
  };
