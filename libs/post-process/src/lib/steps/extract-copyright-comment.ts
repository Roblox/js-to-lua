import { withLeadingComments } from '@js-to-lua/lua-conversion-utils';
import { LuaComment, LuaStatement } from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const extractCopyrightComment: ProcessProgramFunction = (node) => {
  if (!node.body.length) {
    return node;
  }

  const [firstStatement, ...restStatements] = node.body;

  const { statement: newFirstStatement, comments } =
    extractStatementCopyrightComment(firstStatement);

  return withLeadingComments(
    { ...node, body: [newFirstStatement, ...restStatements] },
    ...comments
  );
};

const copyrightRegex = /copyright|@licence|@license/i;

const extractStatementCopyrightComment = (
  statement: LuaStatement
): { statement: LuaStatement; comments: Array<LuaComment> } => {
  if (statement.leadingComments) {
    const copyrightComments = statement.leadingComments.filter((comment) =>
      copyrightRegex.test(comment.value)
    );
    if (copyrightComments.length > 0) {
      const remainingLeadingComments = statement.leadingComments.filter(
        (comment) => !copyrightRegex.test(comment.value)
      );
      return {
        comments: copyrightComments,
        statement: {
          ...statement,
          leadingComments: remainingLeadingComments.length
            ? remainingLeadingComments
            : undefined,
        },
      };
    }
  }

  return {
    statement,
    comments: [],
  };
};
