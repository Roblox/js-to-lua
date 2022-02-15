import { TypeCastExpression } from '@js-to-lua/lua-types';
import { PrintNode } from '../print-node';

export const createPrintTypeCastExpression =
  (printNode: PrintNode) =>
  (node: TypeCastExpression): string => {
    switch (node.expression.type) {
      case 'TypeCastExpression':
        return `(${printNode(node.expression)}) :: ${printNode(
          node.typeAnnotation
        )}`;
      default:
        return `${printNode(node.expression)} :: ${printNode(
          node.typeAnnotation
        )}`;
    }
  };
