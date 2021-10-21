import {
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  program,
  returnStatement,
  typeAny,
  typeCastExpression,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

describe('Program handler', () => {
  describe('TS as Expression Handler', () => {
    it('should handle TSAsExpression in variable declaration', () => {
      const source = `
      let foo = bar as any
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

    it('should handle TSAsExpression in function call params', () => {
      const source = `
      foo(bar as any)
    `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(identifier('foo'), [
            typeCastExpression(identifier('bar'), typeAny()),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TSAsExpression in function return expression', () => {
      const source = `
      function foo() {
        return bar as any
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

    it('should handle double TSAsExpression', () => {
      const source = `
      let foo = bar as any as string
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              typeCastExpression(
                typeCastExpression(identifier('bar'), typeAny()),
                typeString()
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
