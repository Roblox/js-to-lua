import { withTrailingComments } from '@js-to-lua/lua-conversion-utils';
import {
  commentLine,
  functionDeclaration,
  identifier,
  typeAnnotation,
  typeAny,
  typeNumber,
  typeString,
} from '@js-to-lua/lua-types';
import { printFunction } from './print-node';

describe('Print Function', () => {
  it('should print all trailing comments when there is a single function param without type annotation', () => {
    const given = functionDeclaration(identifier('foo'), [
      withTrailingComments(
        identifier('param1'),
        commentLine(' comment after param 1')
      ),
    ]);

    expect(printFunction(given).toString()).toEqual(`function foo(param1
-- comment after param 1
) end`);
  });
  it('should print all trailing comments when there is a single function param with type annotation', () => {
    const given = functionDeclaration(identifier('foo'), [
      withTrailingComments(
        identifier('param1', typeAnnotation(typeNumber())),
        commentLine(' comment after param 1')
      ),
    ]);

    expect(printFunction(given).toString()).toEqual(`function foo(param1: number
-- comment after param 1
) end`);
  });

  it('should print all trailing comments when there are multiple function params with type annotations', () => {
    const given = functionDeclaration(identifier('foo'), [
      withTrailingComments(
        identifier('param1', typeAnnotation(typeNumber())),
        commentLine(' comment after param 1')
      ),
      withTrailingComments(
        identifier('param2', typeAnnotation(typeString())),
        commentLine(' comment after param 2')
      ),
      withTrailingComments(
        identifier('param3', typeAnnotation(typeAny())),
        commentLine(' comment after param 3')
      ),
    ]);

    expect(printFunction(given).toString())
      .toEqual(`function foo(param1: number,
-- comment after param 1
param2: string,
-- comment after param 2
param3: any
-- comment after param 3
) end`);
  });

  it('should print all trailing comments when there are multiple function params', () => {
    const given = functionDeclaration(identifier('foo'), [
      withTrailingComments(
        identifier('param1', typeAnnotation(typeNumber())),
        commentLine(' comment after param 1')
      ),
      withTrailingComments(
        identifier('param2', typeAnnotation(typeString())),
        commentLine(' comment after param 2')
      ),
      withTrailingComments(
        identifier('param3', typeAnnotation(typeAny())),
        commentLine(' comment after param 3')
      ),
    ]);

    expect(printFunction(given).toString())
      .toEqual(`function foo(param1: number,
-- comment after param 1
param2: string,
-- comment after param 2
param3: any
-- comment after param 3
) end`);
  });
});
