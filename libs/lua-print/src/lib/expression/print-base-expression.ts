import { isCommentLine, LuaExpression } from '@js-to-lua/lua-types';
import { printableNode, PrintableNode } from '@js-to-lua/shared-utils';
import { last } from 'ramda';
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
        return printableNode(
          printNode(base).toString(),
          baseHasTrailingSamelineComments
        );
      default:
        return printableNode(
          `(${printNode(base)})`,
          baseHasTrailingSamelineComments
        );
    }
  };
