import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  callExpression,
  expressionStatement,
  functionDeclaration,
  functionExpression,
  identifier,
  numericLiteral,
  program,
  returnStatement,
  tableConstructor,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';

describe('Program handler', () => {
  describe('Sequence Expression Handler', () => {
    it('should handle sequence expression in object prop - with simple expressions', () => {
      const source = `
      const foo = {
        bar: (a = 0, b = a + 1, bar(), a)
      }
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              tableConstructor([
                tableNameKeyField(
                  identifier('bar'),
                  callExpression(
                    functionExpression(
                      [],
                      [
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.EQ,
                          [identifier('a')],
                          [numericLiteral(0, '0')]
                        ),
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.EQ,
                          [identifier('b')],
                          [
                            binaryExpression(
                              identifier('a'),
                              '+',
                              numericLiteral(1, '1')
                            ),
                          ]
                        ),
                        expressionStatement(
                          callExpression(identifier('bar'), [])
                        ),
                        returnStatement(identifier('a')),
                      ]
                    ),
                    []
                  )
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in object prop - with updateExpressions', () => {
      const source = `
      const foo = {
        bar: (a++, b = ++a, a)
      }
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              tableConstructor([
                tableNameKeyField(
                  identifier('bar'),
                  callExpression(
                    functionExpression(
                      [],
                      [
                        expressionStatement(
                          callExpression(
                            functionExpression(
                              [],
                              [
                                variableDeclaration(
                                  [
                                    variableDeclaratorIdentifier(
                                      identifier('result')
                                    ),
                                  ],
                                  [variableDeclaratorValue(identifier('a'))]
                                ),
                                assignmentStatement(
                                  AssignmentStatementOperatorEnum.ADD,
                                  [identifier('a')],
                                  [numericLiteral(1)]
                                ),
                                returnStatement(identifier('result')),
                              ]
                            ),
                            []
                          )
                        ),
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.EQ,
                          [identifier('b')],
                          [
                            callExpression(
                              functionExpression(
                                [],
                                [
                                  assignmentStatement(
                                    AssignmentStatementOperatorEnum.ADD,
                                    [identifier('a')],
                                    [numericLiteral(1)]
                                  ),
                                  returnStatement(identifier('a')),
                                ]
                              ),
                              []
                            ),
                          ]
                        ),
                        returnStatement(identifier('a')),
                      ]
                    ),
                    []
                  )
                ),
              ])
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in variable declaration - with simple expressions', () => {
      const source = `
      const foo = (a = 0, b = a + 1, bar(), a)
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(
                functionExpression(
                  [],
                  [
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('a')],
                      [numericLiteral(0, '0')]
                    ),
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('b')],
                      [
                        binaryExpression(
                          identifier('a'),
                          '+',
                          numericLiteral(1, '1')
                        ),
                      ]
                    ),
                    expressionStatement(callExpression(identifier('bar'), [])),
                    returnStatement(identifier('a')),
                  ]
                ),
                []
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in variable declaration - with updateExpressions', () => {
      const source = `
      const foo = (a++, b = ++a, a)
    `;
      const given = getProgramNode(source);

      const expected = program([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('foo'))],
          [
            variableDeclaratorValue(
              callExpression(
                functionExpression(
                  [],
                  [
                    expressionStatement(
                      callExpression(
                        functionExpression(
                          [],
                          [
                            variableDeclaration(
                              [
                                variableDeclaratorIdentifier(
                                  identifier('result')
                                ),
                              ],
                              [variableDeclaratorValue(identifier('a'))]
                            ),
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.ADD,
                              [identifier('a')],
                              [numericLiteral(1)]
                            ),
                            returnStatement(identifier('result')),
                          ]
                        ),
                        []
                      )
                    ),
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.EQ,
                      [identifier('b')],
                      [
                        callExpression(
                          functionExpression(
                            [],
                            [
                              assignmentStatement(
                                AssignmentStatementOperatorEnum.ADD,
                                [identifier('a')],
                                [numericLiteral(1)]
                              ),
                              returnStatement(identifier('a')),
                            ]
                          ),
                          []
                        ),
                      ]
                    ),
                    returnStatement(identifier('a')),
                  ]
                ),
                []
              )
            ),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in arrow function shorthand return syntax - with simple expressions', () => {
      const source = `
      const foo = () => (a = 0, b = a + 1, bar(), a)
    `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('a')],
              [numericLiteral(0, '0')]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [binaryExpression(identifier('a'), '+', numericLiteral(1, '1'))]
            ),
            expressionStatement(callExpression(identifier('bar'), [])),
            returnStatement(identifier('a')),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in arrow function shorthand return syntax - with function call as last expressions', () => {
      const source = `
      const foo = () => (a = 0, b = a + 1, bar())
    `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('a')],
              [numericLiteral(0, '0')]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [binaryExpression(identifier('a'), '+', numericLiteral(1, '1'))]
            ),
            returnStatement(callExpression(identifier('bar'), [])),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it('should handle sequence expression in arrow function shorthand return syntax - with updateExpressions', () => {
      const source = `
      const foo = () => (a++, b = ++a, a)
    `;
      const given = getProgramNode(source);

      const expected = program([
        functionDeclaration(
          identifier('foo'),
          [],
          [
            expressionStatement(
              callExpression(
                functionExpression(
                  [],
                  [
                    variableDeclaration(
                      [variableDeclaratorIdentifier(identifier('result'))],
                      [variableDeclaratorValue(identifier('a'))]
                    ),
                    assignmentStatement(
                      AssignmentStatementOperatorEnum.ADD,
                      [identifier('a')],
                      [numericLiteral(1)]
                    ),
                    returnStatement(identifier('result')),
                  ]
                ),
                []
              )
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [identifier('b')],
              [
                callExpression(
                  functionExpression(
                    [],
                    [
                      assignmentStatement(
                        AssignmentStatementOperatorEnum.ADD,
                        [identifier('a')],
                        [numericLiteral(1)]
                      ),
                      returnStatement(identifier('a')),
                    ]
                  ),
                  []
                ),
              ]
            ),
            returnStatement(identifier('a')),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
