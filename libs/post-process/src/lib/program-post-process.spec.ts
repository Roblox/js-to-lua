import { withLeadingComments } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  commentBlock,
  identifier,
  program,
} from '@js-to-lua/lua-types';
import { dedent } from '@js-to-lua/shared-utils';
import { postProcess } from './post-process';

describe('Program post process', () => {
  const copyrightTextComment = commentBlock(dedent`
    *
     * Copyright (c) XYZ, Inc. and its affiliates. All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     `);
  const copyrightTagComment = commentBlock(dedent`
    *
     * @file This is my cool script.
     * @copyright XYZ
     `);
  const licenseTagComment = commentBlock(dedent`
    *
     * Utility functions for the foo package.
     * @module foo/util
     * @license MIT
     `);
  const licenceTagComment = commentBlock(dedent`
    *
     * Utility functions for the foo package.
     * @module foo/util
     * @licence MIT
     `);

  describe.each`
    name                | comment
    ${'copyright text'} | ${copyrightTextComment}
    ${'copyright tag'}  | ${copyrightTagComment}
    ${'license tag'}    | ${licenseTagComment}
    ${'licence tag'}    | ${licenceTagComment}
  `('Copyright comments ($name) ', ({ comment }) => {
    it('should move copyright comment to program', () => {
      const given = program([
        withLeadingComments(
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [identifier('bar')]
          ),
          comment
        ),
      ]);

      const expected = withLeadingComments(
        program([
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [identifier('bar')]
          ),
        ]),
        comment
      );

      const actual = postProcess(given);

      expect(actual).toEqual(expected);
    });

    it('should move ONLY copyright comment to program', () => {
      const anotherComment = commentBlock('Another comment');

      const given = program([
        withLeadingComments(
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [identifier('foo')],
            [identifier('bar')]
          ),
          comment,
          anotherComment
        ),
      ]);

      const expected = withLeadingComments(
        program([
          withLeadingComments(
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('foo')],
              [identifier('bar')]
            ),
            anotherComment
          ),
        ]),
        comment
      );

      const actual = postProcess(given);

      expect(actual).toEqual(expected);
    });
  });
});
