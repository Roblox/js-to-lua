import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  breakStatement,
  callExpression,
  elseClause,
  elseifClause,
  expressionStatement,
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
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

describe('Switch Statement Handler', () => {
  const source = '';

  describe('conditional break or return', () => {
    it('should convert simple switch statement', () => {
      const given = getProgramNode(`
      switch(foo) {
        case 1:
          if (condition === 1) break;
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
                    nodeGroup([
                      ifStatement(
                        ifClause(
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(1, '1')
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('entered_')],
                              [booleanLiteral(true)]
                            ),
                            ifStatement(
                              ifClause(
                                binaryExpression(
                                  identifier('condition'),
                                  '==',
                                  numericLiteral(1, '1')
                                ),
                                nodeGroup([
                                  nodeGroup([
                                    assignmentStatement(
                                      AssignmentStatementOperatorEnum.EQ,
                                      [identifier('break_')],
                                      [booleanLiteral(true)]
                                    ),
                                    breakStatement(),
                                  ]),
                                ])
                              )
                            ),
                          ])
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
                          nodeGroup([
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
                          ])
                        )
                      ),
                    ])
                  )
                ),
              ]
            ),
            ifStatement(
              ifClause(
                unaryNegationExpression(identifier('break_')),
                nodeGroup([breakStatement()])
              )
            ),
          ]),
          'ROBLOX comment: switch statement conversion'
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement without default case', () => {
      const given = getProgramNode(`
      switch(foo) {
        case 1:
          if (condition === 1) break;
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
                    nodeGroup([
                      ifStatement(
                        ifClause(
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(1, '1')
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('entered_')],
                              [booleanLiteral(true)]
                            ),
                            ifStatement(
                              ifClause(
                                binaryExpression(
                                  identifier('condition'),
                                  '==',
                                  numericLiteral(1, '1')
                                ),
                                nodeGroup([
                                  nodeGroup([
                                    assignmentStatement(
                                      AssignmentStatementOperatorEnum.EQ,
                                      [identifier('break_')],
                                      [booleanLiteral(true)]
                                    ),
                                    breakStatement(),
                                  ]),
                                ])
                              )
                            ),
                          ])
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
                          nodeGroup([
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
                          ])
                        )
                      ),
                    ])
                  )
                ),
              ]
            ),
          ]),
          'ROBLOX comment: switch statement conversion'
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement with fall-through cases', () => {
      const given = getProgramNode(`
      switch(foo) {
        case 1:
        case 2:
          if (condition === 1) break;
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
                    nodeGroup([
                      ifStatement(
                        ifClause(
                          binaryExpression(
                            identifier('v'),
                            '==',
                            numericLiteral(1, '1')
                          ),
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('entered_')],
                              [booleanLiteral(true)]
                            ),
                          ])
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
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('entered_')],
                              [booleanLiteral(true)]
                            ),
                            ifStatement(
                              ifClause(
                                binaryExpression(
                                  identifier('condition'),
                                  '==',
                                  numericLiteral(1, '1')
                                ),
                                nodeGroup([
                                  nodeGroup([
                                    assignmentStatement(
                                      AssignmentStatementOperatorEnum.EQ,
                                      [identifier('break_')],
                                      [booleanLiteral(true)]
                                    ),
                                    breakStatement(),
                                  ]),
                                ])
                              )
                            ),
                          ])
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
                          nodeGroup([
                            assignmentStatement(
                              AssignmentStatementOperatorEnum.EQ,
                              [identifier('entered_')],
                              [booleanLiteral(true)]
                            ),
                          ])
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
                          nodeGroup([
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
                          ])
                        )
                      ),
                    ])
                  )
                ),
              ]
            ),
            ifStatement(
              ifClause(
                unaryNegationExpression(identifier('break_')),
                nodeGroup([breakStatement()])
              )
            ),
          ]),
          'ROBLOX comment: switch statement conversion'
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });

  describe('unconditional break or return', () => {
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
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('condition_'))],
            [variableDeclaratorValue(identifier('foo'))]
          ),
          ifStatement(
            ifClause(
              binaryExpression(
                identifier('condition_'),
                '==',
                numericLiteral(1, '1')
              ),
              nodeGroup([nodeGroup([])])
            ),
            [
              elseifClause(
                binaryExpression(
                  identifier('condition_'),
                  '==',
                  numericLiteral(2, '2')
                ),
                nodeGroup([nodeGroup([])])
              ),
            ],
            elseClause(nodeGroup([nodeGroup([])]))
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
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
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('condition_'))],
            [variableDeclaratorValue(identifier('foo'))]
          ),
          ifStatement(
            ifClause(
              binaryExpression(
                identifier('condition_'),
                '==',
                numericLiteral(1, '1')
              ),
              nodeGroup([nodeGroup([])])
            ),
            [
              elseifClause(
                binaryExpression(
                  identifier('condition_'),
                  '==',
                  numericLiteral(2, '2')
                ),
                nodeGroup([nodeGroup([])])
              ),
            ]
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
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
        nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(identifier('condition_'))],
            [variableDeclaratorValue(identifier('foo'))]
          ),
          ifStatement(
            ifClause(
              logicalExpression(
                LuaLogicalExpressionOperatorEnum.OR,
                binaryExpression(
                  identifier('condition_'),
                  '==',
                  numericLiteral(1, '1')
                ),
                binaryExpression(
                  identifier('condition_'),
                  '==',
                  numericLiteral(2, '2')
                )
              ),
              nodeGroup([nodeGroup([])])
            ),
            [
              elseifClause(
                logicalExpression(
                  LuaLogicalExpressionOperatorEnum.OR,
                  binaryExpression(
                    identifier('condition_'),
                    '==',
                    numericLiteral(3, '3')
                  ),
                  binaryExpression(
                    identifier('condition_'),
                    '==',
                    numericLiteral(4, '4')
                  )
                ),
                nodeGroup([nodeGroup([])])
              ),
            ],
            elseClause(nodeGroup([nodeGroup([])]))
          ),
        ]),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement with additional fast break', () => {
      const given = getProgramNode(`
      switch(foo) {
        case 1:
          if (breakFast === true) break
          doSth()
          break;
        case 2:
          doSthElse()
          break;
        default:
          doDefaultThing()
          break;
      }
    `);
      const expected = program([
        withInnerConversionComment(
          repeatStatement(booleanLiteral(true), [
            variableDeclaration(
              [variableDeclaratorIdentifier(identifier('condition_'))],
              [variableDeclaratorValue(identifier('foo'))]
            ),
            ifStatement(
              ifClause(
                binaryExpression(
                  identifier('condition_'),
                  '==',
                  numericLiteral(1, '1')
                ),
                nodeGroup([
                  ifStatement(
                    ifClause(
                      binaryExpression(
                        identifier('breakFast'),
                        '==',
                        booleanLiteral(true)
                      ),
                      nodeGroup([breakStatement()])
                    )
                  ),
                  expressionStatement(callExpression(identifier('doSth'))),
                  breakStatement(),
                ])
              ),
              [
                elseifClause(
                  binaryExpression(
                    identifier('condition_'),
                    '==',
                    numericLiteral(2, '2')
                  ),
                  nodeGroup([
                    expressionStatement(
                      callExpression(identifier('doSthElse'))
                    ),
                    breakStatement(),
                  ])
                ),
              ],
              elseClause(
                nodeGroup([
                  expressionStatement(
                    callExpression(identifier('doDefaultThing'))
                  ),
                  breakStatement(),
                ])
              )
            ),
          ]),
          'ROBLOX comment: switch statement conversion'
        ),
      ]);

      const actual = handleProgram.handler(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
