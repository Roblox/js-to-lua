import {
  anyTypeAnnotation,
  CommentLine,
  typeAnnotation as babelTypeAnnotation,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { commentLine, typeAnnotation } from '@js-to-lua/lua-types';
import { mockNode } from '@js-to-lua/lua-types/test-utils';
import { createFlowTypeAnnotationHandler } from './type-annotation.handler';

describe('Flow - TypeAnnotation handler', () => {
  const handler = createFlowTypeAnnotationHandler(
    testUtils.mockNodeHandler
  ).handler;

  const source = '';

  it('should handle node', () => {
    const given = babelTypeAnnotation(anyTypeAnnotation());
    const expected = typeAnnotation(mockNode());

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = {
      ...babelTypeAnnotation(anyTypeAnnotation()),
      leadingComments: [
        { value: 'Leading', type: 'CommentLine' } as CommentLine,
      ],
      innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
      trailingComments: [
        { value: 'Trailing', type: 'CommentLine' } as CommentLine,
      ],
    };
    const expected = {
      ...typeAnnotation(mockNode()),
      leadingComments: [commentLine('Leading')],
      innerComments: [commentLine('Inner')],
      trailingComments: [commentLine('Trailing')],
    };

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
