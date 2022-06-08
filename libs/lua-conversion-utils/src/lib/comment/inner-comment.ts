import {
  BaseLuaNode,
  commentBlock,
  CommentLocation,
  LuaComment,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { trimValueAndWrapWithSpaces } from './trim-values';

export const withInnerComments = <N extends BaseLuaNode>(
  node: N,
  ...comments: LuaComment[]
): N => {
  const innerComments = Array<LuaComment>().concat(
    ...[node.innerComments, comments.filter(isTruthy)].filter(isTruthy)
  );

  return {
    ...node,
    ...(innerComments.length
      ? {
          innerComments: innerComments,
        }
      : {}),
  };
};

const withInnerConversionComments = <N extends BaseLuaNode>(
  node: N,
  location: CommentLocation,
  ...conversionComments: string[]
): N =>
  withInnerComments(
    node,
    ...conversionComments
      .filter(isTruthy)
      .map(trimValueAndWrapWithSpaces)
      .map((comment) => commentBlock(comment, location))
  );

// TODO: We are not renaming this because it changes 80~ references but whenever in need of an additional one (with a different comment location), we can add it as a separate function
export const withInnerConversionComment = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N =>
  withInnerConversionComments(
    node,
    'SameLineInnerComment',
    ...conversionComments
  );

export const withAnyInnerConversionComments = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => withInnerConversionComments(node, 'Any', ...conversionComments);
