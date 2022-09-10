import { LuaCallExpression } from '@js-to-lua/lua-types';
import { fmt, fmtJoin, PrintableNode } from '@js-to-lua/shared-utils';
import { PrintNode } from '../print-node';
import { createPrintCalleeExpression } from './print-callee-expression';

export const createPrintCallExpression = (printNode: PrintNode) => {
  const printCalleeExpression = createPrintCalleeExpression(printNode);

  return (node: LuaCallExpression): string | PrintableNode => {
    const argumentsPrinted = fmtJoin(
      ', ',
      node.arguments.map((e) => printNode(e))
    );

    return fmt`${printCalleeExpression(node.callee)}(${argumentsPrinted})`;
  };
};
