import {
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  nodeGroup,
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
  describe('Flow type cast expression', () => {
    it('should handle TypeCastExpression in variable declaration', () => {
      const source = `
        let foo = (bar:any)
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

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

    it('should handle TypeCastExpression in function call params', () => {
      const source = `
        foo((bar:any))
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = program([
        expressionStatement(
          callExpression(identifier('foo'), [
            typeCastExpression(identifier('bar'), typeAny()),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TypeCastExpression in function return expression', () => {
      const source = `
        function foo() {
          return (bar:any)
        }
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            nodeGroup([
              returnStatement(typeCastExpression(identifier('bar'), typeAny())),
            ]),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle double TypeCastExpression', () => {
      const source = `
        let foo = ((bar:any):string)
      `;
      const given = getProgramNode(source, { plugins: ['flow'] });

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
