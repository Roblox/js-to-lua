import { tableUnpackCall } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  functionDeclaration,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  LuaProgram,
  LuaStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
  program,
  returnStatement,
  stringLiteral,
  typeAnnotation,
  typeAny,
  typeNumber,
  typeOptional,
  typeString,
  typeUnion,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Function Declarations', () => {
    it('should handle function with no params', () => {
      const given = getProgramNode(`
        function foo() {}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(identifier('foo'), [], nodeGroup([])),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params', () => {
      const given = getProgramNode(`
        function foo(bar, baz) {}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [identifier('bar'), identifier('baz')],
          nodeGroup([])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with optional params', () => {
      const given = getProgramNode(`
        function foo(bar?, baz?: string) {}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar', typeAnnotation(typeOptional(typeAny()))),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured params', () => {
      const given = getProgramNode(`
        function foo({bar, baz}, [fizz,fuzz]) {}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [identifier('ref'), identifier('ref_')],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('bar')),
                variableDeclaratorIdentifier(identifier('baz')),
              ],
              [
                variableDeclaratorValue(
                  memberExpression(identifier('ref'), '.', identifier('bar'))
                ),
                variableDeclaratorValue(
                  memberExpression(identifier('ref'), '.', identifier('baz'))
                ),
              ]
            ),
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('fizz')),
                variableDeclaratorIdentifier(identifier('fuzz')),
              ],
              [
                variableDeclaratorValue(
                  tableUnpackCall(
                    identifier('ref_'),
                    numericLiteral(1),
                    numericLiteral(2)
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params and default values', () => {
      const given = getProgramNode(`
        function foo(bar, baz = 'hello', fizz: string | number = 1) {}
      `);
      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
            identifier(
              'fizz',
              typeAnnotation(
                typeOptional(typeUnion([typeString(), typeNumber()]))
              )
            ),
          ],
          nodeGroup([
            ifStatement(
              ifClause(
                binaryExpression(identifier('baz'), '==', nilLiteral()),
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('baz')],
                    [stringLiteral('hello')]
                  ),
                ])
              )
            ),
            ifStatement(
              ifClause(
                binaryExpression(identifier('fizz'), '==', nilLiteral()),
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('fizz')],
                    [numericLiteral(1, '1')]
                  ),
                ])
              )
            ),
          ])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with function body', () => {
      const given = getProgramNode(`
        function foo(bar, baz = 'hello') {
          let fizz = 'fuzz';
        }
      `);

      const expected: LuaProgram = program([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([
            ifStatement(
              ifClause(
                binaryExpression(identifier('baz'), '==', nilLiteral()),
                nodeGroup([
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [identifier('baz')],
                    [stringLiteral('hello')]
                  ),
                ])
              )
            ),
            nodeGroup([
              variableDeclaration(
                [variableDeclaratorIdentifier(identifier('fizz'))],
                [variableDeclaratorValue(stringLiteral('fuzz'))]
              ),
            ]),
          ])
        ),
      ]);

      const luaProgram = handleProgram.handler(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    describe('async', () => {
      it('should handle function with params', () => {
        const given = getProgramNode(`
          async function foo(bar, baz) {}
        `);

        const expected: LuaProgram = program([
          functionDeclaration(
            identifier('foo'),
            [identifier('bar'), identifier('baz')],
            nodeGroup([
              returnStatement(
                callExpression(
                  memberExpression(
                    identifier('Promise'),
                    '.',
                    identifier('resolve')
                  ),
                  [nilLiteral()]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle function with params and default values', () => {
        const given = getProgramNode(`
          async function foo(bar, baz = 'hello') {}
        `);

        const expected: LuaProgram = program([
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              ifStatement(
                ifClause(
                  binaryExpression(identifier('baz'), '==', nilLiteral()),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('baz')],
                      [stringLiteral('hello')]
                    ),
                  ])
                )
              ),
              returnStatement(
                callExpression(
                  memberExpression(
                    identifier('Promise'),
                    '.',
                    identifier('resolve')
                  ),
                  [nilLiteral()]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle function with body', () => {
        const given = getProgramNode(`
          async function foo(bar, baz = 'hello') {
            let fizz = 'fuzz';
          }
        `);

        const expected: LuaProgram = program([
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              ifStatement(
                ifClause(
                  binaryExpression(identifier('baz'), '==', nilLiteral()),
                  nodeGroup([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('baz')],
                      [stringLiteral('hello')]
                    ),
                  ])
                )
              ),
              returnStatement(
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
                    identifier('andThen')
                  ),
                  [
                    functionExpression(
                      [],
                      nodeGroup([
                        variableDeclaration(
                          [variableDeclaratorIdentifier(identifier('fizz'))],
                          [variableDeclaratorValue(stringLiteral('fuzz'))]
                        ),
                      ])
                    ),
                  ]
                )
              ),
            ])
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle double async function declaration', () => {
        const given = getProgramNode(`
          async function foo() {
            return async function bar() {
              return 31337
            }
          }
        `);

        const promiseResolveAndThenCallExpression = (callBody: LuaStatement) =>
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
              identifier('andThen')
            ),
            [functionExpression([], nodeGroup([callBody]))]
          );

        const expected = program([
          functionDeclaration(
            identifier('foo'),
            [],
            nodeGroup([
              returnStatement(
                promiseResolveAndThenCallExpression(
                  returnStatement(
                    functionExpression(
                      [],
                      nodeGroup([
                        returnStatement(
                          promiseResolveAndThenCallExpression(
                            returnStatement(numericLiteral(31337, '31337'))
                          )
                        ),
                      ])
                    )
                  )
                )
              ),
            ])
          ),
        ]);

        const luaProgram = handleProgram.handler(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });
    });
  });
});
