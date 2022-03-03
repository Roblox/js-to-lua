import {
  blockStatement as babelBlockStatement,
  BlockStatement as BabelBlockStatement,
} from '@babel/types';
import {
  blockStatement,
  commentBlock,
  commentLine,
  LuaBlockStatement,
} from '@js-to-lua/lua-types';
import { handleComments } from './handle-comments';

describe('handle comments', () => {
  it('should create leading comment from source', () => {
    const source = `comment`;
    const babelNode: BabelBlockStatement = {
      ...babelBlockStatement([]),
      leadingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 7,
          value: 'comment',
          loc: undefined as any,
        },
      ],
    };
    const luaNode = blockStatement([]);
    expect(handleComments(source, babelNode, luaNode)).toEqual({
      ...blockStatement([]),
      leadingComments: [commentLine('comment')],
    });
  });

  it('should create trailing comment from source', () => {
    const source = `comment`;
    const babelNode: BabelBlockStatement = {
      ...babelBlockStatement([]),
      trailingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 7,
          value: 'comment',
          loc: undefined as any,
        },
      ],
    };
    const luaNode = blockStatement([]);
    expect(handleComments(source, babelNode, luaNode)).toEqual({
      ...blockStatement([]),
      trailingComments: [commentLine('comment')],
    });
  });

  it('should create inner comment from source', () => {
    const source = `comment`;
    const babelNode: BabelBlockStatement = {
      ...babelBlockStatement([]),
      innerComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 7,
          value: 'comment',
          loc: undefined as any,
        },
      ],
    };
    const luaNode = blockStatement([]);
    expect(handleComments(source, babelNode, luaNode)).toEqual({
      ...blockStatement([]),
      innerComments: [commentLine('comment')],
    });
  });

  it('should append leading comment from source to existing comments', () => {
    const source = `comment`;
    const babelNode: BabelBlockStatement = {
      ...babelBlockStatement([]),
      leadingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 7,
          value: 'comment',
          loc: undefined as any,
        },
      ],
    };
    const luaNode: LuaBlockStatement = {
      ...blockStatement([]),
      leadingComments: [commentBlock('conversion comment')],
    };
    expect(handleComments(source, babelNode, luaNode)).toEqual({
      ...blockStatement([]),
      leadingComments: [
        commentBlock('conversion comment'),
        commentLine('comment'),
      ],
    });
  });

  it('should append trailing comment from source to existing comments', () => {
    const source = `comment`;
    const babelNode: BabelBlockStatement = {
      ...babelBlockStatement([]),
      trailingComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 7,
          value: 'comment',
          loc: undefined as any,
        },
      ],
    };
    const luaNode: LuaBlockStatement = {
      ...blockStatement([]),
      trailingComments: [commentBlock('conversion comment')],
    };
    expect(handleComments(source, babelNode, luaNode)).toEqual({
      ...blockStatement([]),
      trailingComments: [
        commentBlock('conversion comment'),
        commentLine('comment'),
      ],
    });
  });

  it('should append inner comment from source to existing comments', () => {
    const source = `comment`;
    const babelNode: BabelBlockStatement = {
      ...babelBlockStatement([]),
      innerComments: [
        {
          type: 'CommentLine',
          start: 0,
          end: 7,
          value: 'comment',
          loc: undefined as any,
        },
      ],
    };
    const luaNode: LuaBlockStatement = {
      ...blockStatement([]),
      innerComments: [commentBlock('conversion comment')],
    };
    expect(handleComments(source, babelNode, luaNode)).toEqual({
      ...blockStatement([]),
      innerComments: [
        commentBlock('conversion comment'),
        commentLine('comment'),
      ],
    });
  });
});
