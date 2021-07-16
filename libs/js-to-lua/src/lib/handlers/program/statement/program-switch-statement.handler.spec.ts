import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  breakStatement,
  callExpression,
  forGenericStatement,
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  nodeGroup,
  numericLiteral,
  program,
  repeatStatement,
  tableConstructor,
  tableNoKeyField,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withInnerConversionComment,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

describe('Switch Statement Handler', () => {
  const source = '';

  it('should convert simple switch statement', () => {
    const given = getProgramNode(`
      switch(foo) {
        case 1:
          break;
        case 2:
          break;
        default:
          break;
      }
    `);
    const expected = program([
      withInnerConversionComment(
        repeatStatement(booleanLiteral(true), [
          variableDeclaration(
            [
              variableDeclaratorIdentifier(identifier('entered_')),
              variableDeclaratorIdentifier(identifier('break_')),
            ],
            [
              variableDeclaratorValue(booleanLiteral(false)),
              variableDeclaratorValue(booleanLiteral(false)),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('condition_'))],
            [variableDeclaratorValue(identifier('foo'))]
          ),
          forGenericStatement(
            [identifier('_'), identifier('v')],
            [
              callExpression(identifier('ipairs'), [
                tableConstructor([
                  tableNoKeyField(numericLiteral(1, '1')),
                  tableNoKeyField(numericLiteral(2, '2')),
                ]),
              ]),
            ],
            [
              ifStatement(
                ifClause(
                  binaryExpression(
                    identifier('condition_'),
                    '==',
                    identifier('v')
                  ),
                  [
                    ifStatement(
                      ifClause(
                        binaryExpression(
                          identifier('v'),
                          '==',
                          numericLiteral(1, '1')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('break_')],
                              [booleanLiteral(true)]
                            ),
                            breakStatement(),
                          ]),
                        ]
                      )
                    ),
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(2, '2')
                          ),
                          identifier('entered_')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('break_')],
                              [booleanLiteral(true)]
                            ),
                            breakStatement(),
                          ]),
                        ]
                      )
                    ),
                  ]
                )
              ),
            ]
          ),
          ifStatement(
            ifClause(unaryNegationExpression(identifier('break_')), [
              breakStatement(),
            ])
          ),
        ]),
        'ROBLOX comment: switch statement conversion'
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it('should convert switch statement without default case', () => {
    const given = getProgramNode(`
      switch(foo) {
        case 1:
          break;
        case 2:
          break;
      }
    `);

    const expected = program([
      withInnerConversionComment(
        repeatStatement(booleanLiteral(true), [
          variableDeclaration(
            [
              variableDeclaratorIdentifier(identifier('entered_')),
              variableDeclaratorIdentifier(identifier('break_')),
            ],
            [
              variableDeclaratorValue(booleanLiteral(false)),
              variableDeclaratorValue(booleanLiteral(false)),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('condition_'))],
            [variableDeclaratorValue(identifier('foo'))]
          ),
          forGenericStatement(
            [identifier('_'), identifier('v')],
            [
              callExpression(identifier('ipairs'), [
                tableConstructor([
                  tableNoKeyField(numericLiteral(1, '1')),
                  tableNoKeyField(numericLiteral(2, '2')),
                ]),
              ]),
            ],
            [
              ifStatement(
                ifClause(
                  binaryExpression(
                    identifier('condition_'),
                    '==',
                    identifier('v')
                  ),
                  [
                    ifStatement(
                      ifClause(
                        binaryExpression(
                          identifier('v'),
                          '==',
                          numericLiteral(1, '1')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('break_')],
                              [booleanLiteral(true)]
                            ),
                            breakStatement(),
                          ]),
                        ]
                      )
                    ),
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(2, '2')
                          ),
                          identifier('entered_')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('break_')],
                              [booleanLiteral(true)]
                            ),
                            breakStatement(),
                          ]),
                        ]
                      )
                    ),
                  ]
                )
              ),
            ]
          ),
        ]),
        'ROBLOX comment: switch statement conversion'
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });

  it('should convert switch statement with fall-through cases', () => {
    const given = getProgramNode(`
      switch(foo) {
        case 1:
        case 2:
          break;
        case 3:
        case 4:
          break;
        default:
          break;
      }
    `);

    const expected = program([
      withInnerConversionComment(
        repeatStatement(booleanLiteral(true), [
          variableDeclaration(
            [
              variableDeclaratorIdentifier(identifier('entered_')),
              variableDeclaratorIdentifier(identifier('break_')),
            ],
            [
              variableDeclaratorValue(booleanLiteral(false)),
              variableDeclaratorValue(booleanLiteral(false)),
            ]
          ),
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('condition_'))],
            [variableDeclaratorValue(identifier('foo'))]
          ),
          forGenericStatement(
            [identifier('_'), identifier('v')],
            [
              callExpression(identifier('ipairs'), [
                tableConstructor([
                  tableNoKeyField(numericLiteral(1, '1')),
                  tableNoKeyField(numericLiteral(2, '2')),
                  tableNoKeyField(numericLiteral(3, '3')),
                  tableNoKeyField(numericLiteral(4, '4')),
                ]),
              ]),
            ],
            [
              ifStatement(
                ifClause(
                  binaryExpression(
                    identifier('condition_'),
                    '==',
                    identifier('v')
                  ),
                  [
                    ifStatement(
                      ifClause(
                        binaryExpression(
                          identifier('v'),
                          '==',
                          numericLiteral(1, '1')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                        ]
                      )
                    ),
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(2, '2')
                          ),
                          identifier('entered_')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('break_')],
                              [booleanLiteral(true)]
                            ),
                            breakStatement(),
                          ]),
                        ]
                      )
                    ),
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(3, '3')
                          ),
                          identifier('entered_')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                        ]
                      )
                    ),
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(4, '4')
                          ),
                          identifier('entered_')
                        ),
                        [
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('break_')],
                              [booleanLiteral(true)]
                            ),
                            breakStatement(),
                          ]),
                        ]
                      )
                    ),
                  ]
                )
              ),
            ]
          ),
          ifStatement(
            ifClause(unaryNegationExpression(identifier('break_')), [
              breakStatement(),
            ])
          ),
        ]),
        'ROBLOX comment: switch statement conversion'
      ),
    ]);

    expect(handleProgram.handler(source, {}, given)).toEqual(expected);
  });
});
