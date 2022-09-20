import {
  tableUnpackCall,
  withLeadingComments,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  callExpression,
  commentBlock,
  elseExpressionClause,
  functionDeclaration,
  functionExpression,
  identifier,
  ifElseExpression,
  ifExpressionClause,
  LuaStatement,
  memberExpression,
  nilLiteral,
  nodeGroup,
  numericLiteral,
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
import { convertProgram } from '../../../convert-program';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Function Declarations', () => {
    it('should handle function with no params', () => {
      const given = getProgramNode(`
        function foo() {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(identifier('foo'), [], nodeGroup([])),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with no params and comment', () => {
      const given = getProgramNode(`
        function foo() /* comment */ {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [],
          withLeadingComments(
            nodeGroup([]),
            commentBlock(' comment ', 'SameLineLeadingComment')
          )
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params', () => {
      const given = getProgramNode(`
        function foo(bar, baz) {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [identifier('bar'), identifier('baz')],
          nodeGroup([])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with optional params', () => {
      const given = getProgramNode(`
        function foo(bar?, baz?: string) {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar', typeAnnotation(typeOptional(typeAny()))),
            identifier('baz', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with destructured params', () => {
      const given = getProgramNode(`
        function foo({bar, baz}, [fizz,fuzz]) {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [identifier('ref0'), identifier('ref1')],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('bar')),
                variableDeclaratorIdentifier(identifier('baz')),
              ],
              [
                variableDeclaratorValue(
                  memberExpression(identifier('ref0'), '.', identifier('bar'))
                ),
                variableDeclaratorValue(
                  memberExpression(identifier('ref0'), '.', identifier('baz'))
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
                    identifier('ref1'),
                    numericLiteral(1),
                    numericLiteral(2)
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with params and default values', () => {
      const given = getProgramNode(`
        function foo(bar, baz = 'hello', fizz: string | number = 1) {}
      `);
      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz_', typeAnnotation(typeOptional(typeString()))),
            identifier(
              'fizz_',
              typeAnnotation(
                typeOptional(typeUnion([typeString(), typeNumber()]))
              )
            ),
          ],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier('baz', typeAnnotation(typeString()))
                ),
              ],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('baz_'), '~=', nilLiteral()),
                      identifier('baz_')
                    ),
                    elseExpressionClause(stringLiteral('hello'))
                  )
                ),
              ]
            ),
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier(
                    'fizz',
                    typeAnnotation(typeUnion([typeString(), typeNumber()]))
                  )
                ),
              ],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('fizz_'), '~=', nilLiteral()),
                      identifier('fizz_')
                    ),
                    elseExpressionClause(numericLiteral(1, '1'))
                  )
                ),
              ]
            ),
          ])
        ),
      ]);

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    it('should handle function with function body', () => {
      const given = getProgramNode(`
        function foo(bar, baz = 'hello') {
          let fizz = 'fuzz';
        }
      `);

      const expected = programWithUpstreamComment([
        functionDeclaration(
          identifier('foo'),
          [
            identifier('bar'),
            identifier('baz_', typeAnnotation(typeOptional(typeString()))),
          ],
          nodeGroup([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(
                  identifier('baz', typeAnnotation(typeString()))
                ),
              ],
              [
                variableDeclaratorValue(
                  ifElseExpression(
                    ifExpressionClause(
                      binaryExpression(identifier('baz_'), '~=', nilLiteral()),
                      identifier('baz_')
                    ),
                    elseExpressionClause(stringLiteral('hello'))
                  )
                ),
              ]
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

      const luaProgram = convertProgram(source, {}, given);
      expect(luaProgram).toEqual(expected);
    });

    describe('async', () => {
      it('should handle function with params', () => {
        const given = getProgramNode(`
          async function foo(bar, baz) {}
        `);

        const expected = programWithUpstreamComment([
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

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle function with params and default values', () => {
        const given = getProgramNode(`
          async function foo(bar, baz = 'hello') {}
        `);

        const expected = programWithUpstreamComment([
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz_', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier('baz', typeAnnotation(typeString()))
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('baz_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('baz_')
                      ),
                      elseExpressionClause(stringLiteral('hello'))
                    )
                  ),
                ]
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

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });

      it('should handle function with body', () => {
        const given = getProgramNode(`
          async function foo(bar, baz = 'hello') {
            let fizz = 'fuzz';
          }
        `);

        const expected = programWithUpstreamComment([
          functionDeclaration(
            identifier('foo'),
            [
              identifier('bar'),
              identifier('baz_', typeAnnotation(typeOptional(typeString()))),
            ],
            nodeGroup([
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    identifier('baz', typeAnnotation(typeString()))
                  ),
                ],
                [
                  variableDeclaratorValue(
                    ifElseExpression(
                      ifExpressionClause(
                        binaryExpression(
                          identifier('baz_'),
                          '~=',
                          nilLiteral()
                        ),
                        identifier('baz_')
                      ),
                      elseExpressionClause(stringLiteral('hello'))
                    )
                  ),
                ]
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

        const luaProgram = convertProgram(source, {}, given);
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

        const expected = programWithUpstreamComment([
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

        const luaProgram = convertProgram(source, {}, given);
        expect(luaProgram).toEqual(expected);
      });
    });
  });
});
