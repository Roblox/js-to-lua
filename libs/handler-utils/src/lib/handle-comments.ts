import { Comment, SourceLocation } from '@babel/types';
import { LuaComment, LuaNode } from '@js-to-lua/lua-types';
import { appendComments } from './append-comments';
import { prependComments } from './prepend-comments';
import { BabelNode } from './types';

const handledComments = new Map() as Map<Comment, LuaComment>;

export const handleComments = <R extends LuaNode>(
  source: string,
  { leadingComments, innerComments, trailingComments, loc }: BabelNode,
  luaNode: R,
  shouldWrap = false
): R => {
  const toLuaComment = (comment: Comment) =>
    handleComment(source, comment, loc);

  return {
    ...luaNode,
    ...(leadingComments
      ? {
          leadingComments: (shouldWrap ? prependComments : appendComments)(
            luaNode.leadingComments,
            leadingComments.map(toLuaComment)
          ),
        }
      : {}),
    ...(innerComments
      ? {
          innerComments: appendComments(
            luaNode.innerComments,
            innerComments.map(toLuaComment)
          ),
        }
      : {}),
    ...(trailingComments
      ? {
          trailingComments: appendComments(
            luaNode.trailingComments,
            trailingComments.map(toLuaComment)
          ),
        }
      : {}),
  };
};

const handleComment = (
  _source: string,
  comment: Comment,
  loc: SourceLocation | null
): LuaComment => {
  if (!handledComments.has(comment)) {
    handledComments.set(comment, {
      type: comment.type,
      value: comment.value,
      loc: 'Any',
    });
  }
  const handled = handledComments.get(comment)!;

  if (!loc || handled.loc === 'SameLineLeadingAndTrailingComment') {
    return handled;
  }

  if (
    loc.start.line == comment.loc.end.line &&
    loc.start.column >= comment.loc.end.column
  ) {
    if (handled.loc === 'SameLineTrailingComment') {
      handled.loc = 'SameLineLeadingAndTrailingComment';
    } else {
      handled.loc = 'SameLineLeadingComment';
    }
  }

  if (
    loc.end.line == comment.loc.start.line &&
    loc.end.column <= comment.loc.start.column
  ) {
    if (handled.loc === 'SameLineLeadingComment') {
      handled.loc = 'SameLineLeadingAndTrailingComment';
    } else {
      handled.loc = 'SameLineTrailingComment';
    }
  }

  return handled;
};
