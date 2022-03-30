import {
  blockStatement as babelBlockStatement,
  callExpression as babelCallExpression,
  expressionStatement as babelExpressionStatement,
  forOfStatement as babelForOfStatement,
  identifier as babelIdentifier,
  memberExpression as babelMemberExpression,
  tsParameterProperty,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';
import { testUtils } from '@js-to-lua/handler-utils';
import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  forGenericStatement,
  identifier,
  nodeGroup,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
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

    const given = babelForOfStatement(
      variableDeclaration('const', [
        variableDeclarator(babelIdentifier('foo')),
      ]),
      { ...babelIdentifier('bar'), start: 0, end: 3 },
      babelBlockStatement([])
    );

    const expected = forGenericStatement(
      [identifier('_'), mockNodeWithValue(babelIdentifier('foo'))],
      [
        withTrailingConversionComment(
          callExpression(identifier('ipairs'), [
            mockNodeWithValue({ ...babelIdentifier('bar'), start: 0, end: 3 }),
          ]),
          "ROBLOX CHECK: check if 'bar' is an Array"
        ),
      ],
      [nodeGroup([])]
    );

    expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle loop with body`, () => {
    const source = 'bar';

    const given = babelForOfStatement(
      variableDeclaration('const', [
        variableDeclarator(babelIdentifier('foo')),
      ]),
      { ...babelIdentifier('bar'), start: 0, end: 3 },
      babelBlockStatement([
        babelExpressionStatement(
          babelCallExpression(babelIdentifier('func'), [])
        ),
      ])
    );

    const expected = forGenericStatement(
      [identifier('_'), mockNodeWithValue(babelIdentifier('foo'))],
      [
        withTrailingConversionComment(
          callExpression(identifier('ipairs'), [
            mockNodeWithValue({ ...babelIdentifier('bar'), start: 0, end: 3 }),
          ]),
          "ROBLOX CHECK: check if 'bar' is an Array"
        ),
      ],
      [
        nodeGroup([
          mockNodeWithValue(
            babelExpressionStatement(
              babelCallExpression(babelIdentifier('func'), [])
            )
          ),
        ]),
      ]
    );

    expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
  });

  describe('unhandled cases', function () {
    it('should not handle for await of statement', () => {
      const given = babelForOfStatement(
        variableDeclaration('const', [
          variableDeclarator(babelIdentifier('foo')),
        ]),
        babelIdentifier('bar'),
        babelBlockStatement([]),
        true
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForOfStatement with await modifier`
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for of statement unhandled value on the left side', () => {
      const given = babelForOfStatement(
        tsParameterProperty(babelIdentifier('foo')),
        babelIdentifier('bar'),
        babelBlockStatement([])
      );

      const expected = withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ForOfStatement where left side is not handled`
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });

    it('should not handle for of statement without variable declaration that is not an identifier', () => {
      const source = 'bar';

      const given = babelForOfStatement(
        variableDeclaration('const', [
          variableDeclarator(
            babelMemberExpression(babelIdentifier('f'), babelIdentifier('oo'))
          ),
        ]),
        { ...babelIdentifier('bar'), start: 0, end: 3 },
        babelBlockStatement([])
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
          withTrailingConversionComment(
            callExpression(identifier('ipairs'), [
              mockNodeWithValue({
                ...babelIdentifier('bar'),
                start: 0,
                end: 3,
              }),
            ]),
            "ROBLOX CHECK: check if 'bar' is an Array"
          ),
        ],
        [nodeGroup([])]
      );

      expect(handleForOfStatement.handler(source, {}, given)).toEqual(expected);
    });
  });
});
