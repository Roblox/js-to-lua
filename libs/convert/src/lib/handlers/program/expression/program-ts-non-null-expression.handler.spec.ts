import {
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  indexExpression,
  nodeGroup,
  returnStatement,
  typeAny,
  typeCastExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('TS Non Null Expression Handler', () => {
    it('should handle TSNonNullExpression in variable declaration', () => {
      const source = `
        let foo = bar!
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              typeCastExpression(identifier('bar'), typeAny())
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function call params', () => {
      const source = `
        foo(bar!)
        foo!(bar!)
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        expressionStatement(
          callExpression(identifier('foo'), [
            typeCastExpression(identifier('bar'), typeAny()),
          ])
        ),
        expressionStatement(
          callExpression(typeCastExpression(identifier('foo'), typeAny()), [
            typeCastExpression(identifier('bar'), typeAny()),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function return expression', () => {
      const source = `
        function foo() {
          return bar!
        }
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            returnStatement(typeCastExpression(identifier('bar'), typeAny())),
          ])
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function index expression', () => {
      const source = `
        const foo = bar[baz!]
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              indexExpression(
                identifier('bar'),
                callExpression(identifier('tostring'), [
                  typeCastExpression(identifier('baz'), typeAny()),
                ])
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function index expression - second', () => {
      const source = `
        const foo = bar![baz!]
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              indexExpression(
                typeCastExpression(identifier('bar'), typeAny()),
                callExpression(identifier('tostring'), [
                  typeCastExpression(identifier('baz'), typeAny()),
                ])
              )
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });

    it('should handle double TSNonNullExpression', () => {
      const source = `
        let foo = bar!!
      `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              typeCastExpression(identifier('bar'), typeAny())
            ),
          ]
        ),
      ]);

      expect(convertProgram(source, {}, given)).toEqual(expected);
    });
  });
});
