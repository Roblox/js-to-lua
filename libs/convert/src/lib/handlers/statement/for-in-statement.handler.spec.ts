import * as Babel from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  forGenericStatement,
  identifier,
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import {
  mockNodeWithValue,
  withLocation,
} from '@js-to-lua/lua-types/test-utils';
import { createForInStatementHandler } from './for-in-statement.handler';

const handleForInStatement = createForInStatementHandler(
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler
);

const source = '';

describe('For In statement Handler', () => {
  it(`should handle empty loop`, () => {
    const given = Babel.forInStatement(
      Babel.variableDeclaration('const', [
        Babel.variableDeclarator(Babel.identifier('foo')),
      ]),
      Babel.identifier('bar'),
      Babel.blockStatement([])
    );

    const expected = forGenericStatement(
      [mockNodeWithValue(Babel.identifier('foo'))],
      [mockNodeWithValue(Babel.identifier('bar'))],
      [nodeGroup([])]
    );

    expect(handleForInStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loop with body`, () => {
    const given = Babel.forInStatement(
      Babel.variableDeclaration('const', [
        Babel.variableDeclarator(Babel.identifier('foo')),
      ]),
      Babel.identifier('bar'),
      Babel.blockStatement([
        Babel.expressionStatement(
          Babel.callExpression(Babel.identifier('func'), [])
        ),
      ])
    );

    const expected = forGenericStatement(
      [mockNodeWithValue(Babel.identifier('foo'))],
      [mockNodeWithValue(Babel.identifier('bar'))],
      [
        nodeGroup([
          mockNodeWithValue(
            Babel.expressionStatement(
              Babel.callExpression(Babel.identifier('func'), [])
            )
          ),
        ]),
      ]
    );

    expect(handleForInStatement.handler(source, {}, given)).toEqual(expected);
  });

  describe('unhandled cases', function () {
    it('should not handle for in statement unhandled value on the left side', () => {
      const given = Babel.forInStatement(
        Babel.tsParameterProperty(Babel.identifier('foo')),
        Babel.identifier('bar'),
        Babel.blockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForInStatement where left side is not handled`
      );

      expect(handleForInStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for in statement without variable declaration that is not an identifier', () => {
      const given = Babel.forInStatement(
        Babel.variableDeclaration('const', [
          Babel.variableDeclarator(
            Babel.memberExpression(
              Babel.identifier('f'),
              Babel.identifier('oo')
            )
          ),
        ]),
        Babel.identifier('bar'),
        Babel.blockStatement([])
      );

      const expected = forGenericStatement(
        [
          withTrailingConversionComment(
            identifier('__unhandledIdentifier__'),
            `ROBLOX TODO: Unhandled node for type: MemberExpression within ForInStatement left expression`
          ),
        ],
        [mockNodeWithValue(Babel.identifier('bar'))],
        [nodeGroup([])]
      );

      expect(handleForInStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for in statement with empty variable declaration', () => {
      const source = 'bar';

      const given = Babel.forInStatement(
        Babel.variableDeclaration('const', []),
        withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
        Babel.blockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForInStatement where left side declaration doesn't have exactly one declarator`
      );

      expect(handleForInStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for in statement with multiple variable declarators', () => {
      const source = 'bar';

      const given = Babel.forInStatement(
        Babel.variableDeclaration('const', [
          Babel.variableDeclarator(Babel.identifier('foo')),
          Babel.variableDeclarator(Babel.identifier('bar')),
        ]),
        withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
        Babel.blockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForInStatement where left side declaration doesn't have exactly one declarator`
      );

      expect(handleForInStatement.handler(source, {}, given)).toEqual(expected);
    });
  });
});
