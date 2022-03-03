import { BaseLuaNode, commentBlock, LuaComment } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { trimValueAndWrapWithSpaces } from './trim-values';

export const withLeadingConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => {
  const leadingComments = Array<LuaComment>().concat(
    ...[
      node.leadingComments,
      conversionComments
        .filter(isTruthy)
        .map(trimValueAndWrapWithSpaces)
        .map((comment) => commentBlock(comment, 'SameLineLeadingComment')),
    ].filter(isTruthy)
  );

  return {
    ...node,
    ...(leadingComments.length
      ? {
          leadingComments,
        }
      : {}),
  };
};
