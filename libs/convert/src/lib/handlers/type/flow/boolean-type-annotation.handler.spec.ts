import { booleanTypeAnnotation, CommentLine } from '@babel/types';
import { commentLine, typeBoolean } from '@js-to-lua/lua-types';
import { createFlowBooleanTypeAnnotationHandler } from './boolean-type-annotation.handler';

describe('Flow - BooleanTypeAnnotation handler', () => {
  const handler = createFlowBooleanTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = booleanTypeAnnotation();
    const expected = typeBoolean();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = {
      ...booleanTypeAnnotation(),
      leadingComments: [
        { value: 'Leading', type: 'CommentLine' } as CommentLine,
      ],
      innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
      trailingComments: [
        { value: 'Trailing', type: 'CommentLine' } as CommentLine,
      ],
    };
    const expected = {
      ...typeBoolean(),
      leadingComments: [commentLine('Leading')],
      innerComments: [commentLine('Inner')],
      trailingComments: [commentLine('Trailing')],
    };

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
