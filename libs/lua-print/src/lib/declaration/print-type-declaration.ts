import { LuaTypeAliasDeclaration } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeAliasDeclaration =
  (printNode: PrintNode) => (node: LuaTypeAliasDeclaration) => {
    const typeParameters =
      node.typeParameters && node.typeParameters.length
        ? `<${node.typeParameters.map((n) => printNode(n)).join(', ')}>`
        : '';

    return `type ${printNode(node.id)}${typeParameters} = ${printNode(
      node.typeAnnotation
    )}`;
  };
