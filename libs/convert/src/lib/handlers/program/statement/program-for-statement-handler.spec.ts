import { withTrailingConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  blockStatement,
  booleanLiteral,
  callExpression,
  continueStatement,
  expressionStatement,
  functionDeclaration,
  functionExpression,
  identifier,
  ifClause,
  ifStatement,
  memberExpression,
  nodeGroup,
  numericLiteral,
  returnStatement,
  tableConstructor,
  tableNameKeyField,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  whileStatement,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import {
  getProgramNode,
  programWithUpstreamComment,
} from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('For statement handler', () => {
    it('should handle basic for loop', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10; i++) {
          foo(i)
        }
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle basic for loop with continue statement', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10; i++) {
          if(i === 2) continue
          foo(i)
        }
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                ifStatement(
                  ifClause(
                    binaryExpression(
                      identifier('i'),
                      '==',
                      numericLiteral(2, '2')
                    ),
                    nodeGroup([
                      nodeGroup([
                        assignmentStatement(
                          AssignmentStatementOperatorEnum.ADD,
                          [identifier('i')],
                          [numericLiteral(1)]
                        ),
                        continueStatement(),
                      ]),
                    ])
                  )
                ),

                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle for statement with no variable declaration', () => {
      const given = getProgramNode(`
        for (; i < 10; i++) {
          foo(i)
        }
      `);
      const expected = programWithUpstreamComment([
        whileStatement(
          withTrailingConversionComment(
            binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
            `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
          ),
          [
            nodeGroup([
              expressionStatement(
                callExpression(identifier('foo'), [identifier('i')])
              ),
            ]),
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.ADD,
                [identifier('i')],
                [numericLiteral(1)]
              ),
            ]),
          ]
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle for statement with no test node', () => {
      const given = getProgramNode(`
        for (let i = 0;; i++) {
          foo(i)
        }
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(booleanLiteral(true), [
            nodeGroup([
              expressionStatement(
                callExpression(identifier('foo'), [identifier('i')])
              ),
            ]),
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.ADD,
                [identifier('i')],
                [numericLiteral(1)]
              ),
            ]),
          ]),
        ]),
      ]);

      const handledGiven = handleProgram.handler(source, {}, given);
      expect(handledGiven).toEqual(expected);
    });

    it('should handle for statement with no update', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10;) {
          foo(i)
        }
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle for statement with no variable declaration, no test case, and no update', () => {
      const given = getProgramNode(`
        for (;;) {
          foo(i)
        }
      `);
      const expected = programWithUpstreamComment([
        whileStatement(booleanLiteral(true), [
          nodeGroup([
            expressionStatement(
              callExpression(identifier('foo'), [identifier('i')])
            ),
          ]),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle for statement with a single statement, not array of statements, for the body', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10; i++) foo(i)
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('foo'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle basic for loop with local variable used in a closure', () => {
      const given = getProgramNode(`
        for (let i = 0; i < 10; i++) {
          foo.add({
            bar: () => i
          })
        }
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          functionDeclaration(
            identifier('_loop'),
            [identifier('i')],
            nodeGroup([
              expressionStatement(
                callExpression(
                  memberExpression(identifier('foo'), ':', identifier('add')),
                  [
                    tableConstructor([
                      tableNameKeyField(
                        identifier('bar'),
                        functionExpression(
                          [],
                          nodeGroup([returnStatement(identifier('i'))])
                        )
                      ),
                    ]),
                  ]
                )
              ),
            ])
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('i'))],
            [variableDeclaratorValue(numericLiteral(0, '0'))]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('_loop'), [identifier('i')])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should handle basic for loop with local variable used in a closure - multiple declared variables', () => {
      const given = getProgramNode(`
        for (let j = 1, i = 0; i < 10; i++) {
          foo.add({
            bar: () => i
          })
        }
      `);
      const expected = programWithUpstreamComment([
        blockStatement([
          functionDeclaration(
            identifier('_loop'),
            [identifier('j'), identifier('i')],
            nodeGroup([
              expressionStatement(
                callExpression(
                  memberExpression(identifier('foo'), ':', identifier('add')),
                  [
                    tableConstructor([
                      tableNameKeyField(
                        identifier('bar'),
                        functionExpression(
                          [],
                          nodeGroup([returnStatement(identifier('i'))])
                        )
                      ),
                    ]),
                  ]
                )
              ),
            ])
          ),
          variableDeclaration(
            [
              variableDeclaratorIdentifier(identifier('j')),
              variableDeclaratorIdentifier(identifier('i')),
            ],
            [
              variableDeclaratorValue(numericLiteral(1, '1')),
              variableDeclaratorValue(numericLiteral(0, '0')),
            ]
          ),
          whileStatement(
            withTrailingConversionComment(
              binaryExpression(identifier('i'), '<', numericLiteral(10, '10')),
              `ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number`
            ),
            [
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('_loop'), [
                    identifier('j'),
                    identifier('i'),
                  ])
                ),
              ]),
              nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.ADD,
                  [identifier('i')],
                  [numericLiteral(1)]
                ),
              ]),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
