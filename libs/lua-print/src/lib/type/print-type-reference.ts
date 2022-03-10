import { LuaTypeReference } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeReference =
  (printNode: PrintNode) =>
  (node: LuaTypeReference): string => {
    const genericTypeParameters = node.typeParameters
      ? `<${node.typeParameters.map((n) => printNode(n)).join(', ')}>`
      : '';

    return `${printNode(node.typeName)}${
      node.defaultType ? ` = ${printNode(node.defaultType)}` : ''
    }${genericTypeParameters}`;
  };
