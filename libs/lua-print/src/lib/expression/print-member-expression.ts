import { LuaMemberExpression } from '@js-to-lua/lua-types';
import { fmt, PrintableNode } from '@js-to-lua/shared-utils';
import { PrintComments, PrintNode } from '../print-node';
import { getPrintableInnerComments } from '../printable-comments';
import { createPrintBaseExpression } from './print-base-expression';

export const createPrintMemberExpression = (
  printNode: PrintNode,
  printComments: PrintComments
) => {
  const printBaseExpression = createPrintBaseExpression(printNode);

  return (node: LuaMemberExpression): PrintableNode => {
    const innerComments = printComments(
      getPrintableInnerComments(node.innerComments)
    );

    return fmt`${printBaseExpression(node.base)}${innerComments}${
      node.indexer
    }${printNode(node.identifier)}`;
  };
};
