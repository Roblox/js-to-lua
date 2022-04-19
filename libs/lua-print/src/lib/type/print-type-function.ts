import { LuaTypeFunction } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { PrintNode } from '../print-node';

export const createPrintTypeFunction =
  (printNode: PrintNode) =>
  (node: LuaTypeFunction): string => {
    const parameters = [
      ...node.parameters.map((n) => printNode(n)),
      node.rest && `...${printNode(node.rest)}`,
    ].filter(isTruthy);

    const typeParameters = node.typeParameters
      ? printNode(node.typeParameters)
      : '';

    return `${typeParameters}(${parameters.join(', ')}) -> ${printNode(
      node.returnType
    )}`;
  };
