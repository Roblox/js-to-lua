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
} from '@js-to-lua/lua-types';
import { handleStatement } from '../expression-statement.handler';

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
      []
    );

    expect(handleStatement.handler(source, {}, given)).toEqual(expected);
  });
});