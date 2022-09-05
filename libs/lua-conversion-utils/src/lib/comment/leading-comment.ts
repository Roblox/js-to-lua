import {
  BaseLuaNode,
  commentBlock,
  CommentLocation,
  LuaComment,
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { trimValueAndWrapWithSpaces } from './trim-values';

export const withLeadingComments = <N extends BaseLuaNode>(
  node: N,
  ...comments: LuaComment[]
): N => {
  const leadingComments = Array<LuaComment>().concat(
    ...[node.leadingComments, comments].filter(isTruthy)
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

export const prependLeadingComments = <N extends BaseLuaNode>(
  node: N,
  ...comments: LuaComment[]
): N => {
  const leadingComments = Array<LuaComment>().concat(
    ...[comments, node.leadingComments].filter(isTruthy)
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

export const withLeadingConversionComments = <N extends BaseLuaNode>(
  node: N,
  location: CommentLocation,
  ...conversionComments: string[]
): N =>
  withLeadingComments(
    node,
    ...conversionComments
      .filter(isTruthy)
      .map(trimValueAndWrapWithSpaces)
      .map((comment) => commentBlock(comment, location))
  );

export const withSameLineLeadingConversionComments = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N =>
  withLeadingConversionComments(
    node,
    'SameLineLeadingComment',
    ...conversionComments
  );

export const withAnyLeadingConversionComments = <N extends BaseLuaNode>(
  node: N,
  ...conversionComments: string[]
): N => withLeadingConversionComments(node, 'Any', ...conversionComments);
