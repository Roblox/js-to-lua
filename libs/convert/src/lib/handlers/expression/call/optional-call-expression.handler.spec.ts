import * as Babel from '@babel/types';
import {
  asStatementInline,
  asStatementReturnTypeStandaloneOrInline,
  asStatementStandalone,
  createHandlerFunction,
  testUtils,
} from '@js-to-lua/handler-utils';
import { generateUniqueIdentifier } from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  elseExpressionClause,
  expressionStatement,
  functionExpression,
  identifier,
  ifClause,
  ifElseExpression,
  ifExpressionClause,
  ifStatement,
  nilLiteral,
  nodeGroup,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import {
  createOptionalCallExpressionAsStatementHandler,
  createOptionalCallExpressionHandler,
} from './optional-call-expression.handler';

const { mockNodeWithValueHandler } = testUtils;
describe('OptionalCallExpression handler', () => {
  describe('as expression', () => {
    const testIdentifiers = [{ idName: 'foo' }, { idName: 'bar' }];

    const { handler } = createOptionalCallExpressionHandler(
      mockNodeWithValueHandler
    );

    it.each(testIdentifiers)(
      "should handle simple identifier optional call expression for '$id' identifier",
      ({ idName }) => {
        const given = Babel.optionalCallExpression(
          Babel.identifier(idName),
          [],
          true
        );

        const refId = identifier(generateUniqueIdentifier([], 'ref'));

        const expected = callExpression(
          functionExpression(
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(refId)],
                [variableDeclaratorValue(mockNodeWithValue(identifier(idName)))]
              ),
              returnStatement(
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(refId, '~=', nilLiteral()),
                    callExpression(refId, [])
                  ),
                  elseExpressionClause(nilLiteral())
                )
              ),
            ])
          )
        );

        const actual = handler('', {}, given);

        expect(actual).toEqual(expected);
      }
    );

    it.each(testIdentifiers)(
      'should handle simple identifier optional call expression with params',
      ({ idName }) => {
        const given = Babel.optionalCallExpression(
          Babel.identifier(idName),
          [
            Babel.identifier('param1'),
            Babel.identifier('param2'),
            Babel.identifier('param3'),
          ],
          true
        );

        const refId = identifier(generateUniqueIdentifier([], 'ref'));

        const expected = callExpression(
          functionExpression(
            [],
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(refId)],
                [variableDeclaratorValue(mockNodeWithValue(identifier(idName)))]
              ),
              returnStatement(
                ifElseExpression(
                  ifExpressionClause(
                    binaryExpression(refId, '~=', nilLiteral()),
                    callExpression(refId, [
                      mockNodeWithValue(Babel.identifier('param1')),
                      mockNodeWithValue(Babel.identifier('param2')),
                      mockNodeWithValue(Babel.identifier('param3')),
                    ])
                  ),
                  elseExpressionClause(nilLiteral())
                )
              ),
            ])
          )
        );

        const actual = handler('', {}, given);

        expect(actual).toEqual(expected);
      }
    );
  });

  describe('as statement', () => {
    const mockExpressionAsStatementHandler = jest
      .fn()
      .mockImplementation(mockNodeWithValueHandler);

    const { handler } = createOptionalCallExpressionAsStatementHandler(
      createHandlerFunction(mockExpressionAsStatementHandler)
    );

    it('should handle simple identifier optional call expression', () => {
      mockExpressionAsStatementHandler.mockImplementationOnce(() => {
        return identifier('foo');
      });

      const given = Babel.optionalCallExpression(
        Babel.identifier('foo'),
        [],
        false
      );

      const expected = asStatementReturnTypeStandaloneOrInline(
        asStatementStandalone(
          [],
          ifStatement(
            ifClause(
              binaryExpression(identifier('foo'), '~=', nilLiteral()),
              nodeGroup([
                expressionStatement(callExpression(identifier('foo'))),
              ])
            )
          ),
          []
        ),
        asStatementInline(
          [],
          [],
          ifElseExpression(
            ifExpressionClause(
              binaryExpression(identifier('foo'), '~=', nilLiteral()),
              callExpression(identifier('foo'))
            ),
            elseExpressionClause(nilLiteral())
          )
        )
      );

      expect(handler('', {}, given)).toEqual(expected);
    });
  });
});
