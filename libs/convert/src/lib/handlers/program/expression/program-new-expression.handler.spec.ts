import { dateTimeMethodCall } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
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
  describe('New Expression Handler', () => {
    it('handle new expression without params', () => {
      const source = `
        let v = new ClassConstructor()
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
                []
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('handle new expression on member expression without params', () => {
      const source = `
        let v = new NamespaceObject.ClassConstructor()
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

    it('should handle new Date expression', () => {
      const source = `
        const t = new Date()
      `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('t'))],
          [variableDeclaratorValue(dateTimeMethodCall('now'))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
