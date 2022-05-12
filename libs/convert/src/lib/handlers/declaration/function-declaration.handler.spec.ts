import {
  FunctionDeclaration,
  functionDeclaration as babelFunctionDeclaration,
  identifier as babelIdentifier,
  blockStatement as babelBlockStatement,
} from '@babel/types';
import {
  functionDeclaration,
  identifier,
  LuaFunctionDeclaration,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { statementHandler } from '../expression-statement.handler';

const source = '';

describe('Function Declaration', () => {
  it(`should return LuaFunctionDeclaration Node`, () => {
    const given: FunctionDeclaration = babelFunctionDeclaration(
      babelIdentifier('foo'),
      [babelIdentifier('bar'), babelIdentifier('baz')],
      babelBlockStatement([])
    );
    const expected: LuaFunctionDeclaration = functionDeclaration(
      identifier('foo'),
      [identifier('bar'), identifier('baz')],
      nodeGroup([])
    );

    expect(statementHandler.handler(source, {}, given)).toEqual(expected);
  });
});
