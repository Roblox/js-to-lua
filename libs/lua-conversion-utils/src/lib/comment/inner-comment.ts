import { BaseLuaNode, commentBlock, LuaComment } from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { trimValueAndWrapWithSpaces } from './trim-values';

export const withInnerConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => {
  const innerComments = Array<LuaComment>().concat(
    ...[
      node.innerComments,
      conversionComments
        .filter(isTruthy)
        .map(trimValueAndWrapWithSpaces)
        .map((comment) => commentBlock(comment, 'SameLineInnerComment')),
    ].filter(isTruthy)
  );
  return {
    ...node,
    ...(innerComments.length ? { innerComments: innerComments } : {}),
  };
};
