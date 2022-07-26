import { isCommentLine, LuaExpression } from '@js-to-lua/lua-types';
import { last } from 'ramda';
import { PrintableNode, printableNode } from '../fmt';
import { PrintNode } from '../print-node';

export const createPrintBaseExpression =
  (printNode: PrintNode) =>
  (base: LuaExpression): PrintableNode => {
    const lastTrailingComment = last(base?.trailingComments || []);
    const baseHasTrailingSamelineComments =
      !!lastTrailingComment && isCommentLine(lastTrailingComment);

    switch (base.type) {
      case 'Identifier':
      case 'CallExpression':
      case 'IndexExpression':
      case 'LuaMemberExpression':
        return printableNode(printNode(base), baseHasTrailingSamelineComments);
      default:
        return printableNode(
          `(${printNode(base)})`,
          baseHasTrailingSamelineComments
        );
    }
  };
