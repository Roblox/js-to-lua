import {
  BaseLuaNode,
  commentBlock,
  CommentLocation,
  LuaComment,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { trimValueAndWrapWithSpaces } from './trim-values';

export const withTrailingComments = <N extends BaseLuaNode>(
  node: N,
  ...comments: LuaComment[]
): N => {
  const trailingComments = Array<LuaComment>().concat(
    ...[node.trailingComments, comments.filter(isTruthy)].filter(isTruthy)
  );

  return {
    ...node,
    ...(trailingComments.length
      ? {
          trailingComments,
        }
      : {}),
  };
};

const withTrailingConversionComments = <N extends BaseLuaNode>(
  node: N,
  location: CommentLocation,
  ...conversionComments: string[]
): N =>
  withTrailingComments(
    node,
    ...conversionComments
      .filter(isTruthy)
      .map(trimValueAndWrapWithSpaces)
      .map((comment) => commentBlock(comment, location))
  );

// TODO: We are not renaming this because it changes 500~ references but whenever in need of an additional one (with a different comment location), we can add it as a separate function
export const withTrailingConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N =>
  withTrailingConversionComments(
    node,
    'SameLineTrailingComment',
    ...conversionComments
  );

export const withAnyTrailingConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => withTrailingConversionComments(node, 'Any', ...conversionComments);
