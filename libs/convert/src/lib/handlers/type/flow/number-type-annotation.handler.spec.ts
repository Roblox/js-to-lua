import { CommentLine, numberTypeAnnotation } from '@babel/types';
import { commentLine, typeNumber } from '@js-to-lua/lua-types';
import { createFlowNumberTypeAnnotationHandler } from './number-type-annotation.handler';

describe('Flow - NumberTypeAnnotation handler', () => {
  const handler = createFlowNumberTypeAnnotationHandler().handler;

  const source = '';

  it('should handle node', () => {
    const given = numberTypeAnnotation();
    const expected = typeNumber();

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it('should preserve comments', () => {
    const given = {
      ...numberTypeAnnotation(),
      leadingComments: [
        { value: 'Leading', type: 'CommentLine' } as CommentLine,
      ],
      innerComments: [{ value: 'Inner', type: 'CommentLine' } as CommentLine],
      trailingComments: [
        { value: 'Trailing', type: 'CommentLine' } as CommentLine,
      ],
    };
    const expected = {
      ...typeNumber(),
      leadingComments: [commentLine('Leading')],
      innerComments: [commentLine('Inner')],
      trailingComments: [commentLine('Trailing')],
    };

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
