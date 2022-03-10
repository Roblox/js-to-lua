import { CommentLine, stringTypeAnnotation } from '@babel/types';
import { commentLine, typeString } from '@js-to-lua/lua-types';
import { createFlowStringTypeAnnotationHandler } from './string-type-annotation.handler';

describe('Flow - StringTypeAnnotation handler', () => {
  const handler = createFlowStringTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = stringTypeAnnotation();
    const expected = typeString();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = {
      ...stringTypeAnnotation(),
      leadingComments: [
        { value: 'Leading', type: 'CommentLine' } as CommentLine,
      ],
      innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
      trailingComments: [
        { value: 'Trailing', type: 'CommentLine' } as CommentLine,
      ],
    };
    const expected = {
      ...typeString(),
      leadingComments: [commentLine('Leading')],
      innerComments: [commentLine('Inner')],
      trailingComments: [commentLine('Trailing')],
    };

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
