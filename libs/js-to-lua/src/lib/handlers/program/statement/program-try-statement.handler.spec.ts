import {
  assignmentStatement,
  blockStatement,
  booleanLiteral,
  callExpression,
  expressionStatement,
  functionDeclaration,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  program,
  returnStatement,
  stringLiteral,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withInnerConversionComment,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';
describe('Program handler', () => {
  describe('Try Statement Handler', () => {
    it(`should handle simple try-catch`, () => {
      const given = getProgramNode(`
        try {
          a = 'foo';
        } catch (error) {
          b = error.toString();
        }
      `);
      const expected = program([
        withInnerConversionComment(
          blockStatement([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('ok')),
                variableDeclaratorIdentifier(identifier('result')),
                variableDeclaratorIdentifier(identifier('hasReturned')),
              ],
              [
                variableDeclaratorValue(
                  callExpression(identifier('xpcall'), [
                    functionExpression(
                      [],
                      [
                        expressionStatement(
                          assignmentStatement(
                            [identifier('a')],
                            [stringLiteral('foo')]
                          )
                        ),
                      ]
                    ),
                    functionExpression(
                      [identifier('error_')],
                      [
                        expressionStatement(
                          assignmentStatement(
                            [identifier('b')],
                            [
                              callExpression(identifier('tostring'), [
                                identifier('error_'),
                              ]),
                            ]
                          )
                        ),
                      ]
                    ),
                  ])
                ),
              ]
            ),
            ifStatement(
              ifClause(identifier('hasReturned'), [
                returnStatement(identifier('result')),
              ])
            ),
          ]),
          'ROBLOX COMMENT: try-catch block conversion'
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle simple try-finally`, () => {
      const given = getProgramNode(`
        try {
          a = 'foo';
        } finally {
          b = 'bar';
        }
      `);
      const expected = program([
        withInnerConversionComment(
          blockStatement([
            variableDeclaration(
              [
                variableDeclaratorIdentifier(identifier('ok')),
                variableDeclaratorIdentifier(identifier('result')),
                variableDeclaratorIdentifier(identifier('hasReturned')),
              ],
              [
                variableDeclaratorValue(
                  callExpression(identifier('pcall'), [
                    functionExpression(
                      [],
                      [
                        expressionStatement(
                          assignmentStatement(
                            [identifier('a')],
                            [stringLiteral('foo')]
                          )
                        ),
                      ]
                    ),
                  ])
                ),
              ]
            ),
            blockStatement([
              expressionStatement(
                assignmentStatement([identifier('b')], [stringLiteral('bar')])
              ),
            ]),
            ifStatement(
              ifClause(identifier('hasReturned'), [
                returnStatement(identifier('result')),
              ])
            ),
            ifStatement(
              ifClause(unaryNegationExpression(identifier('ok')), [
                callExpression(identifier('error'), [identifier('result')]),
              ])
            ),
          ]),
          'ROBLOX COMMENT: try-finally block conversion'
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle try-finally with finally returning`, () => {
      const given = getProgramNode(`
        function foo() {
          try {
            a = 'foo';
          } finally {
            return 'bar';
          }
        }
      `);
      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            withInnerConversionComment(
              blockStatement([
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(identifier('ok')),
                    variableDeclaratorIdentifier(identifier('result')),
                    variableDeclaratorIdentifier(identifier('hasReturned')),
                  ],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('pcall'), [
                        functionExpression(
                          [],
                          [
                            expressionStatement(
                              assignmentStatement(
                                [identifier('a')],
                                [stringLiteral('foo')]
                              )
                            ),
                          ]
                        ),
                      ])
                    ),
                  ]
                ),
                blockStatement([returnStatement(stringLiteral('bar'))]),
                ifStatement(
                  ifClause(identifier('hasReturned'), [
                    returnStatement(identifier('result')),
                  ])
                ),
                ifStatement(
                  ifClause(unaryNegationExpression(identifier('ok')), [
                    callExpression(identifier('error'), [identifier('result')]),
                  ])
                ),
              ]),
              'ROBLOX COMMENT: try-finally block conversion'
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle try-finally with finally returning`, () => {
      const given = getProgramNode(`
        function foo() {
          try {
            return 'foo';
          } catch (error) {
            b = error.toString();
          } finally {
            c = 'baz';
          }
        }
      `);
      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            withInnerConversionComment(
              blockStatement([
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(identifier('ok')),
                    variableDeclaratorIdentifier(identifier('result')),
                    variableDeclaratorIdentifier(identifier('hasReturned')),
                  ],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('xpcall'), [
                        functionExpression(
                          [],
                          [
                            returnStatement(
                              stringLiteral('foo'),
                              booleanLiteral(true)
                            ),
                          ]
                        ),
                        functionExpression(
                          [identifier('error_')],
                          [
                            expressionStatement(
                              assignmentStatement(
                                [identifier('b')],
                                [
                                  callExpression(identifier('tostring'), [
                                    identifier('error_'),
                                  ]),
                                ]
                              )
                            ),
                          ]
                        ),
                      ])
                    ),
                  ]
                ),
                blockStatement([
                  expressionStatement(
                    assignmentStatement(
                      [identifier('c')],
                      [stringLiteral('baz')]
                    )
                  ),
                ]),
                ifStatement(
                  ifClause(identifier('hasReturned'), [
                    returnStatement(identifier('result')),
                  ])
                ),
              ]),
              'ROBLOX COMMENT: try-catch-finally block conversion'
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle try-finally with both catch and finally returning`, () => {
      const given = getProgramNode(`
        function foo() {
          try {
            return 'foo';
          } catch (error) {
            b = error.toString();
          } finally {
            return 'baz';
          }
        }
      `);
      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            withInnerConversionComment(
              blockStatement([
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(identifier('ok')),
                    variableDeclaratorIdentifier(identifier('result')),
                    variableDeclaratorIdentifier(identifier('hasReturned')),
                  ],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('xpcall'), [
                        functionExpression(
                          [],
                          [
                            returnStatement(
                              stringLiteral('foo'),
                              booleanLiteral(true)
                            ),
                          ]
                        ),
                        functionExpression(
                          [identifier('error_')],
                          [
                            expressionStatement(
                              assignmentStatement(
                                [identifier('b')],
                                [
                                  callExpression(identifier('tostring'), [
                                    identifier('error_'),
                                  ]),
                                ]
                              )
                            ),
                          ]
                        ),
                      ])
                    ),
                  ]
                ),
                blockStatement([returnStatement(stringLiteral('baz'))]),
                ifStatement(
                  ifClause(identifier('hasReturned'), [
                    returnStatement(identifier('result')),
                  ])
                ),
              ]),
              'ROBLOX COMMENT: try-catch-finally block conversion'
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle try-finally with all try, catch and finally returning`, () => {
      const given = getProgramNode(`
        function foo() {
          try {
            return 'foo';
          } catch {
            return 'bar'
          } finally {
            return 'baz';
          }
        }
      `);
      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            withInnerConversionComment(
              blockStatement([
                variableDeclaration(
                  [
                    variableDeclaratorIdentifier(identifier('ok')),
                    variableDeclaratorIdentifier(identifier('result')),
                    variableDeclaratorIdentifier(identifier('hasReturned')),
                  ],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('xpcall'), [
                        functionExpression(
                          [],
                          [
                            returnStatement(
                              stringLiteral('foo'),
                              booleanLiteral(true)
                            ),
                          ]
                        ),
                        functionExpression(
                          [],
                          [
                            returnStatement(
                              stringLiteral('bar'),
                              booleanLiteral(true)
                            ),
                          ]
                        ),
                      ])
                    ),
                  ]
                ),
                blockStatement([returnStatement(stringLiteral('baz'))]),
                ifStatement(
                  ifClause(identifier('hasReturned'), [
                    returnStatement(identifier('result')),
                  ])
                ),
              ]),
              'ROBLOX COMMENT: try-catch-finally block conversion'
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
