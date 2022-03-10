import { anyTypeAnnotation, CommentLine } from '@babel/types';
import { commentLine, typeAny } from '@js-to-lua/lua-types';
import { createFlowAnyTypeAnnotationHandler } from './any-type-annotation.handler';

describe('Flow - AnyTypeAnnotation handler', () => {
  const handler = createFlowAnyTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = anyTypeAnnotation();
    const expected = typeAny();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = {
      ...anyTypeAnnotation(),
      leadingComments: [
        { value: 'Leading', type: 'CommentLine' } as CommentLine,
      ],
      innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
      trailingComments: [
        { value: 'Trailing', type: 'CommentLine' } as CommentLine,
      ],
    };
    const expected = {
      ...typeAny(),
      leadingComments: [commentLine('Leading')],
      innerComments: [commentLine('Inner')],
      trailingComments: [commentLine('Trailing')],
    };

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
