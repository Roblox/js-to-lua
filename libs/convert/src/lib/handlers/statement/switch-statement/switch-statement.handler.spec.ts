import * as Babel from '@babel/types';
import {
  combineHandlers,
  createHandler,
  testUtils,
} from '@js-to-lua/handler-utils';
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
  forGenericStatement,
  identifier,
  ifClause,
  ifStatement,
  logicalExpression,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nodeGroup,
  repeatStatement,
  tableConstructor,
  tableNoKeyField,
  unaryNegationExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { mockNodeWithValue } from '@js-to-lua/lua-types/test-utils';
import { createSwitchStatementHandler } from './switch-statement.handler';

const { mockNodeWithValueHandler, mockNodeAsStatementWithValueHandler } =
  testUtils;

describe('Switch Statement Handler', () => {
  const handleSwitchStatement = createSwitchStatementHandler(
    combineHandlers<LuaStatement, Babel.Statement>(
      [createHandler('BreakStatement', () => breakStatement())],
      mockNodeWithValueHandler
    ).handler,
    mockNodeWithValueHandler,
    mockNodeAsStatementWithValueHandler
  ).handler;

  const source = '';

  describe('unconditional break or return or continue', () => {
    it('should convert simple switch statement', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), [Babel.breakStatement()]),
        Babel.switchCase(Babel.numericLiteral(2), [Babel.breakStatement()]),
        Babel.switchCase(null, [Babel.breakStatement()]),
      ]);
      const expected = nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('condition_'))],
          [variableDeclaratorValue(mockNodeWithValue(Babel.identifier('foo')))]
        ),
        ifStatement(
          ifClause(
            binaryExpression(
              identifier('condition_'),
              '==',
              mockNodeWithValue(Babel.numericLiteral(1))
            ),
            nodeGroup([nodeGroup([])])
          ),
          [
            elseifClause(
              binaryExpression(
                identifier('condition_'),
                '==',
                mockNodeWithValue(Babel.numericLiteral(2))
              ),
              nodeGroup([nodeGroup([])])
            ),
          ],
          elseClause(nodeGroup([nodeGroup([])]))
        ),
      ]);

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert simple switch statement with continue', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), [Babel.breakStatement()]),
        Babel.switchCase(Babel.numericLiteral(2), [Babel.continueStatement()]),
        Babel.switchCase(null, [Babel.breakStatement()]),
      ]);
      const expected = nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('condition_'))],
          [variableDeclaratorValue(mockNodeWithValue(Babel.identifier('foo')))]
        ),
        ifStatement(
          ifClause(
            binaryExpression(
              identifier('condition_'),
              '==',
              mockNodeWithValue(Babel.numericLiteral(1))
            ),
            nodeGroup([nodeGroup([])])
          ),
          [
            elseifClause(
              binaryExpression(
                identifier('condition_'),
                '==',
                mockNodeWithValue(Babel.numericLiteral(2))
              ),
              nodeGroup([mockNodeWithValue(Babel.continueStatement())])
            ),
          ],
          elseClause(nodeGroup([nodeGroup([])]))
        ),
      ]);

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement without default case', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), [Babel.breakStatement()]),
        Babel.switchCase(Babel.numericLiteral(2), [Babel.breakStatement()]),
      ]);
      const expected = nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('condition_'))],
          [variableDeclaratorValue(mockNodeWithValue(Babel.identifier('foo')))]
        ),
        ifStatement(
          ifClause(
            binaryExpression(
              identifier('condition_'),
              '==',
              mockNodeWithValue(Babel.numericLiteral(1))
            ),
            nodeGroup([nodeGroup([])])
          ),
          [
            elseifClause(
              binaryExpression(
                identifier('condition_'),
                '==',
                mockNodeWithValue(Babel.numericLiteral(2))
              ),
              nodeGroup([nodeGroup([])])
            ),
          ]
        ),
      ]);

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement with fall-through cases', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), []),
        Babel.switchCase(Babel.numericLiteral(2), [Babel.breakStatement()]),
        Babel.switchCase(Babel.numericLiteral(3), []),
        Babel.switchCase(Babel.numericLiteral(4), [Babel.breakStatement()]),
        Babel.switchCase(null, [Babel.breakStatement()]),
      ]);
      const expected = nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('condition_'))],
          [variableDeclaratorValue(mockNodeWithValue(Babel.identifier('foo')))]
        ),
        ifStatement(
          ifClause(
            logicalExpression(
              LuaLogicalExpressionOperatorEnum.OR,
              binaryExpression(
                identifier('condition_'),
                '==',
                mockNodeWithValue(Babel.numericLiteral(1))
              ),
              binaryExpression(
                identifier('condition_'),
                '==',
                mockNodeWithValue(Babel.numericLiteral(2))
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
                  mockNodeWithValue(Babel.numericLiteral(3))
                ),
                binaryExpression(
                  identifier('condition_'),
                  '==',
                  mockNodeWithValue(Babel.numericLiteral(4))
                )
              ),
              nodeGroup([nodeGroup([])])
            ),
          ],
          elseClause(nodeGroup([nodeGroup([])]))
        ),
      ]);

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });

  describe('conditional break or return', () => {
    it('should convert simple switch statement', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), [Babel.breakStatement()]),
        Babel.switchCase(Babel.numericLiteral(2), [
          Babel.ifStatement(
            Babel.identifier('condition'),
            Babel.blockStatement([Babel.breakStatement()])
          ),
        ]),
        Babel.switchCase(null, [Babel.breakStatement()]),
      ]);
      const expected = withInnerConversionComment(
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
            [
              variableDeclaratorValue(
                mockNodeWithValue(Babel.identifier('foo'))
              ),
            ]
          ),
          forGenericStatement(
            [identifier('_'), identifier('v')],
            [
              callExpression(identifier('ipairs'), [
                tableConstructor([
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(1))),
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(2))),
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
                          mockNodeWithValue(Babel.numericLiteral(1))
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
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            mockNodeWithValue(Babel.numericLiteral(2))
                          ),
                          identifier('entered_')
                        ),
                        nodeGroup([
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          mockNodeWithValue(
                            Babel.ifStatement(
                              Babel.identifier('condition'),
                              Babel.blockStatement([Babel.breakStatement()])
                            )
                          ),
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
      );

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement without default case', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), [Babel.breakStatement()]),
        Babel.switchCase(Babel.numericLiteral(2), [
          Babel.ifStatement(
            Babel.identifier('condition'),
            Babel.blockStatement([Babel.breakStatement()])
          ),
        ]),
      ]);
      const expected = withInnerConversionComment(
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
            [
              variableDeclaratorValue(
                mockNodeWithValue(Babel.identifier('foo'))
              ),
            ]
          ),
          forGenericStatement(
            [identifier('_'), identifier('v')],
            [
              callExpression(identifier('ipairs'), [
                tableConstructor([
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(1))),
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(2))),
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
                          mockNodeWithValue(Babel.numericLiteral(1))
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
                    ifStatement(
                      ifClause(
                        logicalExpression(
                          LuaLogicalExpressionOperatorEnum.OR,
                          binaryExpression(
                            identifier('v'),
                            '==',
                            mockNodeWithValue(Babel.numericLiteral(2))
                          ),
                          identifier('entered_')
                        ),
                        nodeGroup([
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          mockNodeWithValue(
                            Babel.ifStatement(
                              Babel.identifier('condition'),
                              Babel.blockStatement([Babel.breakStatement()])
                            )
                          ),
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
      );

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });

    it('should convert switch statement with fall-through cases', () => {
      const given = Babel.switchStatement(Babel.identifier('foo'), [
        Babel.switchCase(Babel.numericLiteral(1), []),
        Babel.switchCase(Babel.numericLiteral(2), [
          Babel.ifStatement(
            Babel.identifier('condition'),
            Babel.blockStatement([Babel.breakStatement()])
          ),
        ]),
        Babel.switchCase(Babel.numericLiteral(3), []),
        Babel.switchCase(Babel.numericLiteral(4), [Babel.breakStatement()]),
        Babel.switchCase(null, [Babel.breakStatement()]),
      ]);
      const expected = withInnerConversionComment(
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
            [
              variableDeclaratorValue(
                mockNodeWithValue(Babel.identifier('foo'))
              ),
            ]
          ),
          forGenericStatement(
            [identifier('_'), identifier('v')],
            [
              callExpression(identifier('ipairs'), [
                tableConstructor([
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(1))),
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(2))),
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(3))),
                  tableNoKeyField(mockNodeWithValue(Babel.numericLiteral(4))),
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
                          mockNodeWithValue(Babel.numericLiteral(1))
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
                            mockNodeWithValue(Babel.numericLiteral(2))
                          ),
                          identifier('entered_')
                        ),
                        nodeGroup([
                          assignmentStatement(
                            AssignmentStatementOperatorEnum.EQ,
                            [identifier('entered_')],
                            [booleanLiteral(true)]
                          ),
                          mockNodeWithValue(
                            Babel.ifStatement(
                              Babel.identifier('condition'),
                              Babel.blockStatement([Babel.breakStatement()])
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
                            mockNodeWithValue(Babel.numericLiteral(3))
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
                            mockNodeWithValue(Babel.numericLiteral(4))
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
      );

      const actual = handleSwitchStatement(source, {}, given);
      expect(actual).toEqual(expected);
    });
  });
});
