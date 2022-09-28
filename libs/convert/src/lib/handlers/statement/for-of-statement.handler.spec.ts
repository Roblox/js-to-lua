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
import { createForOfStatementHandler } from './for-of-statement.handler';

const handleForOfStatement = createForOfStatementHandler(
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler,
  testUtils.mockNodeWithValueHandler
);

const source = '';

describe('For Of statement Handler', () => {
  it(`should handle empty loop`, () => {
    const source = 'bar';

    const given = Babel.forOfStatement(
      Babel.variableDeclaration('const', [
        Babel.variableDeclarator(Babel.identifier('foo')),
      ]),
      withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
      Babel.blockStatement([])
    );

    const expected = forGenericStatement(
      [identifier('_'), mockNodeWithValue(Babel.identifier('foo'))],
      [
        mockNodeWithValue(
          withLocation({ start: 0, end: 3 })(Babel.identifier('bar'))
        ),
      ],
      [nodeGroup([])]
    );

    expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loop with body`, () => {
    const source = 'bar';

    const given = Babel.forOfStatement(
      Babel.variableDeclaration('const', [
        Babel.variableDeclarator(Babel.identifier('foo')),
      ]),
      withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
      Babel.blockStatement([
        Babel.expressionStatement(
          Babel.callExpression(Babel.identifier('func'), [])
        ),
      ])
    );

    const expected = forGenericStatement(
      [identifier('_'), mockNodeWithValue(Babel.identifier('foo'))],
      [
        mockNodeWithValue(
          withLocation({ start: 0, end: 3 })(Babel.identifier('bar'))
        ),
      ],
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

    expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
  });

  describe('unhandled cases', function () {
    it('should not handle for await of statement', () => {
      const given = Babel.forOfStatement(
        Babel.variableDeclaration('const', [
          Babel.variableDeclarator(Babel.identifier('foo')),
        ]),
        Babel.identifier('bar'),
        Babel.blockStatement([]),
        true
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForOfStatement with await modifier`
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for of statement unhandled value on the left side', () => {
      const given = Babel.forOfStatement(
        Babel.tsParameterProperty(Babel.identifier('foo')),
        Babel.identifier('bar'),
        Babel.blockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForOfStatement where left side is not handled`
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for of statement without variable declaration that is not an identifier', () => {
      const source = 'bar';

      const given = Babel.forOfStatement(
        Babel.variableDeclaration('const', [
          Babel.variableDeclarator(
            Babel.memberExpression(
              Babel.identifier('f'),
              Babel.identifier('oo')
            )
          ),
        ]),
        withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
        Babel.blockStatement([])
      );

      const expected = forGenericStatement(
        [
          identifier('_'),
          withTrailingConversionComment(
            identifier('__unhandledIdentifier__'),
            `ROBLOX TODO: Unhandled node for type: MemberExpression within ForOfStatement left expression`
          ),
        ],
        [
          mockNodeWithValue(
            withLocation({ start: 0, end: 3 })(Babel.identifier('bar'))
          ),
        ],
        [nodeGroup([])]
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for of statement with empty variable declaration', () => {
      const source = 'bar';

      const given = Babel.forOfStatement(
        Babel.variableDeclaration('const', []),
        withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
        Babel.blockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForOfStatement where left side declaration doesn't have exactly one declarator`
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for of statement with multiple variable declarators', () => {
      const source = 'bar';

      const given = Babel.forOfStatement(
        Babel.variableDeclaration('const', [
          Babel.variableDeclarator(Babel.identifier('foo')),
          Babel.variableDeclarator(Babel.identifier('bar')),
        ]),
        withLocation({ start: 0, end: 3 })(Babel.identifier('bar')),
        Babel.blockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForOfStatement where left side declaration doesn't have exactly one declarator`
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });
  });
});
