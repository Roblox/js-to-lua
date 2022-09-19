import {
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  nodeGroup,
  returnStatement,
  typeAny,
  typeCastExpression,
  typeString,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

describe('Program handler', () => {
  describe('TS as Expression Handler', () => {
    it('should handle TSAsExpression in variable declaration', () => {
      const source = `
      let foo = bar as any
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

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle TSAsExpression in function call params', () => {
      const source = `
      foo(bar as any)
    `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
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

      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [],
          nodeGroup([
            returnStatement(typeCastExpression(identifier('bar'), typeAny())),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle double TSAsExpression', () => {
      const source = `
      let foo = bar as any as string
    `;
      const given = getProgramNode(source);

      const expected = programWithUpstreamComment([
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
