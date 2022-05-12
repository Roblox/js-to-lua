import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  booleanLiteral,
  callExpression,
  expressionStatement,
  functionDeclaration,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  nodeGroup,
  program,
  returnStatement,
  stringLiteral,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

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
                      nodeGroup([
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.EQ,
                          [identifier('a')],
                          [stringLiteral('foo')]
                        ),
                      ])
                    ),
                    functionExpression(
                      [identifier('error_')],
                      nodeGroup([
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.EQ,
                          [identifier('b')],
                          [
                            callExpression(identifier('tostring'), [
                              identifier('error_'),
                            ]),
                          ]
                        ),
                      ])
                    ),
                  ])
                ),
              ]
            ),
            ifStatement(
              ifClause(
                identifier('hasReturned'),
                nodeGroup([returnStatement(identifier('result'))])
              )
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
                      nodeGroup([
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.EQ,
                          [identifier('a')],
                          [stringLiteral('foo')]
                        ),
                      ])
                    ),
                  ])
                ),
              ]
            ),
            blockStatement([
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('b')],
                [stringLiteral('bar')]
              ),
            ]),
            ifStatement(
              ifClause(
                identifier('hasReturned'),
                nodeGroup([returnStatement(identifier('result'))])
              )
            ),
            ifStatement(
              ifClause(
                unaryNegationExpression(identifier('ok')),
                nodeGroup([
                  expressionStatement(
                    callExpression(identifier('error'), [identifier('result')])
                  ),
                ])
              )
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
          nodeGroup([
            nodeGroup([
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
                            nodeGroup([
                              assignmentStatement(
                                AssignmentStatementOperatorEnum.EQ,
                                [identifier('a')],
                                [stringLiteral('foo')]
                              ),
                            ])
                          ),
                        ])
                      ),
                    ]
                  ),
                  blockStatement([returnStatement(stringLiteral('bar'))]),
                  ifStatement(
                    ifClause(
                      identifier('hasReturned'),
                      nodeGroup([returnStatement(identifier('result'))])
                    )
                  ),
                  ifStatement(
                    ifClause(
                      unaryNegationExpression(identifier('ok')),
                      nodeGroup([
                        expressionStatement(
                          callExpression(identifier('error'), [
                            identifier('result'),
                          ])
                        ),
                      ])
                    )
                  ),
                ]),
                'ROBLOX COMMENT: try-finally block conversion'
              ),
            ]),
          ])
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
          nodeGroup([
            nodeGroup([
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
                            nodeGroup([
                              returnStatement(
                                stringLiteral('foo'),
                                booleanLiteral(true)
                              ),
                            ])
                          ),
                          functionExpression(
                            [identifier('error_')],
                            nodeGroup([
                              assignmentStatement(
                                AssignmentStatementOperatorEnum.EQ,
                                [identifier('b')],
                                [
                                  callExpression(identifier('tostring'), [
                                    identifier('error_'),
                                  ]),
                                ]
                              ),
                            ])
                          ),
                        ])
                      ),
                    ]
                  ),
                  blockStatement([
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('c')],
                      [stringLiteral('baz')]
                    ),
                  ]),
                  ifStatement(
                    ifClause(
                      identifier('hasReturned'),
                      nodeGroup([returnStatement(identifier('result'))])
                    )
                  ),
                ]),
                'ROBLOX COMMENT: try-catch-finally block conversion'
              ),
            ]),
          ])
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
          nodeGroup([
            nodeGroup([
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
                            nodeGroup([
                              returnStatement(
                                stringLiteral('foo'),
                                booleanLiteral(true)
                              ),
                            ])
                          ),
                          functionExpression(
                            [identifier('error_')],
                            nodeGroup([
                              assignmentStatement(
                                AssignmentStatementOperatorEnum.EQ,
                                [identifier('b')],
                                [
                                  callExpression(identifier('tostring'), [
                                    identifier('error_'),
                                  ]),
                                ]
                              ),
                            ])
                          ),
                        ])
                      ),
                    ]
                  ),
                  blockStatement([returnStatement(stringLiteral('baz'))]),
                  ifStatement(
                    ifClause(
                      identifier('hasReturned'),
                      nodeGroup([returnStatement(identifier('result'))])
                    )
                  ),
                ]),
                'ROBLOX COMMENT: try-catch-finally block conversion'
              ),
            ]),
          ])
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
          nodeGroup([
            nodeGroup([
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
                            nodeGroup([
                              returnStatement(
                                stringLiteral('foo'),
                                booleanLiteral(true)
                              ),
                            ])
                          ),
                          functionExpression(
                            [],
                            nodeGroup([
                              returnStatement(
                                stringLiteral('bar'),
                                booleanLiteral(true)
                              ),
                            ])
                          ),
                        ])
                      ),
                    ]
                  ),
                  blockStatement([returnStatement(stringLiteral('baz'))]),
                  ifStatement(
                    ifClause(
                      identifier('hasReturned'),
                      nodeGroup([returnStatement(identifier('result'))])
                    )
                  ),
                ]),
                'ROBLOX COMMENT: try-catch-finally block conversion'
              ),
            ]),
          ])
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
