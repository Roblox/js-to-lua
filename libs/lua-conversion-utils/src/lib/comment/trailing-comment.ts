import { BaseLuaNode, commentBlock, LuaComment } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { trimValueAndWrapWithSpaces } from './trim-values';

export const withTrailingConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => {
  const trailingComments = Array<LuaComment>().concat(
    ...[
      node.trailingComments,
      conversionComments
        .filter(isTruthy)
        .map(trimValueAndWrapWithSpaces)
        .map((comment) => commentBlock(comment, 'SameLineTrailingComment')),
    ].filter(isTruthy)
  );

  return {
    ...node,
    ...(trailingComments.length
      ? {
          trailingComments: trailingComments,
        }
      : {}),
  };
};
