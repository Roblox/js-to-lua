import {
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  indexExpression,
  program,
  returnStatement,
  typeAny,
  typeCastExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

describe('Program handler', () => {
  describe('TS Non Null Expression Handler', () => {
    it('should handle TSNonNullExpression in variable declaration', () => {
      const source = `
      let foo = bar!
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              typeCastExpression(identifier('bar'), typeAny())
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function call params', () => {
      const source = `
      foo(bar!)
      foo!(bar!)
    `;
      const given = getProgramNode(source);

      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function return expression', () => {
      const source = `
      function foo() {
        return bar!
      }
    `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [returnStatement(typeCastExpression(identifier('bar'), typeAny()))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function index expression', () => {
      const source = `
      const foo = bar[baz!]
    `;
      const given = getProgramNode(source);

      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TSNonNullExpression in function index expression - second', () => {
      const source = `
      const foo = bar![baz!]
    `;
      const given = getProgramNode(source);

      const expected = program([
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle double TSNonNullExpression', () => {
      const source = `
      let foo = bar!!
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              typeCastExpression(identifier('bar'), typeAny())
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
