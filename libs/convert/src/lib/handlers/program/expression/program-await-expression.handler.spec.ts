import {
  callExpression,
  expressionStatement,
  identifier,
  memberExpression,
  program,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

describe('Program handler', () => {
  describe('Await Expression Handler', () => {
    it('should handle awaiting simple identifier', () => {
      const source = `
        await foo
      `;
      const given = getProgramNode(source);

      const expected = program([
        expressionStatement(
          callExpression(
            memberExpression(identifier('foo'), ':', identifier('expect')),
            []
          )
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle awaiting Promise.resolve', () => {
      const source = `
        let foo = await Promise.resolve()
      `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(
                memberExpression(
                  callExpression(
                    memberExpression(
                      identifier('Promise'),
                      '.',
                      identifier('resolve')
                    ),
                    []
                  ),
                  ':',
                  identifier('expect')
                ),
                []
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('handle new expression with params', () => {
      const source = `
        let v = new ClassConstructor(foo, bar)
      `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('v'))],
          [
            variableDeclaratorValue(
              callExpression(
                memberExpression(
                  identifier('ClassConstructor'),
                  '.',
                  identifier('new')
                ),
                [identifier('foo'), identifier('bar')]
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('handle new expression on member expression with params', () => {
      const source = `
        let v = new NamespaceObject.ClassConstructor(foo, bar)
      `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('v'))],
          [
            variableDeclaratorValue(
              callExpression(
                memberExpression(
                  memberExpression(
                    identifier('NamespaceObject'),
                    '.',
                    identifier('ClassConstructor')
                  ),
                  '.',
                  identifier('new')
                ),
                [identifier('foo'), identifier('bar')]
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
