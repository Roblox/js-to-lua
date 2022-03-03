import {
  identifier as babelIdentifier,
  Identifier as BabelIdentifier,
} from '@babel/types';
import { commentLine, identifier } from '@js-to-lua/lua-types';
import { createHandlerFunction } from './create-handler-function';

describe('Create handler function', () => {
  it('should create a curried handler function', () => {
    const handlerFunction = createHandlerFunction(() => identifier('foo'));

    expect(typeof handlerFunction).toBe('function');
    expect(typeof handlerFunction()).toBe('function');
    expect(typeof handlerFunction('source')).toBe('function');
    expect(typeof handlerFunction('source', {})).toBe('function');
    expect(handlerFunction('source', {}, babelIdentifier('foo'))).toEqual(
      identifier('foo')
    );
  });

  it('should add leading comments from the source node', () => {
    const handlerFunction = createHandlerFunction(() => identifier('foo'));
    const sourceNode: BabelIdentifier = {
      ...babelIdentifier('foo'),
      leadingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'leading comment',
        },
      ],
    };

    expect(handlerFunction('source', {}, sourceNode)).toEqual({
      ...identifier('foo'),
      leadingComments: [commentLine('leading comment')],
    });
  });

  it('should add inner comments from the source node', () => {
    const handlerFunction = createHandlerFunction(() => identifier('foo'));
    const sourceNode: BabelIdentifier = {
      ...babelIdentifier('foo'),
      innerComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'inner comment',
        },
      ],
    };

    expect(handlerFunction('source', {}, sourceNode)).toEqual({
      ...identifier('foo'),
      innerComments: [commentLine('inner comment')],
    });
  });

  it('should add trailing comments from the source node', () => {
    const handlerFunction = createHandlerFunction(() => identifier('foo'));
    const sourceNode: BabelIdentifier = {
      ...babelIdentifier('foo'),
      trailingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'trailing comment',
        },
      ],
    };

    expect(handlerFunction('source', {}, sourceNode)).toEqual({
      ...identifier('foo'),
      trailingComments: [commentLine('trailing comment')],
    });
  });

  it('should add all comments from the source node', () => {
    const handlerFunction = createHandlerFunction(() => identifier('foo'));
    const sourceNode: BabelIdentifier = {
      ...babelIdentifier('foo'),
      leadingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'leading comment',
        },
      ],
      innerComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'inner comment',
        },
      ],
      trailingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'trailing comment',
        },
      ],
    };

    expect(handlerFunction('source', {}, sourceNode)).toEqual({
      ...identifier('foo'),
      leadingComments: [commentLine('leading comment')],
      innerComments: [commentLine('inner comment')],
      trailingComments: [commentLine('trailing comment')],
    });
  });

  it('should skip adding comments from the source node', () => {
    const handlerFunction = createHandlerFunction(() => identifier('foo'), {
      skipComments: true,
    });
    const sourceNode: BabelIdentifier = {
      ...babelIdentifier('foo'),
      leadingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'leading comment',
        },
      ],
      innerComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'inner comment',
        },
      ],
      trailingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 0,
          loc: undefined as any,
          value: 'trailing comment',
        },
      ],
    };

    expect(handlerFunction('source', {}, sourceNode)).toEqual(
      identifier('foo')
    );
  });
});
