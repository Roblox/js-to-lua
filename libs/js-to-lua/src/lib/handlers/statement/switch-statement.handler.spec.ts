import {
  breakStatement as babelBreakStatement,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  Statement,
  switchCase as babelSwitchCase,
  switchStatement as babelSwitchStatement,
} from '@babel/types';
import { withInnerConversionComment } from '@js-to-lua/lua-conversion-utils';
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
import { mockNodeWithValueHandler } from '../../testUtils/mock-node';
import { createHandler } from '../../types';
import { combineHandlers } from '../../utils/combine-handlers';
import { createSwitchStatementHandler } from './switch-statement.handler';

describe('Switch Statement Handler', () => {
  const handleSwitchStatement = createSwitchStatementHandler(
    combineHandlers<LuaStatement, Statement>(
      [createHandler('BreakStatement', () => breakStatement())],
      mockNodeWithValueHandler
    ).handler,
    mockNodeWithValueHandler
  ).handler;

  const source = '';

  it('should convert simple switch statement', () => {
    const given = babelSwitchStatement(babelIdentifier('foo'), [
      babelSwitchCase(babelNumericLiteral(1), [babelBreakStatement()]),
      babelSwitchCase(babelNumericLiteral(2), [babelBreakStatement()]),
      babelSwitchCase(null, [babelBreakStatement()]),
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
          [variableDeclaratorValue(mockNodeWithValue(babelIdentifier('foo')))]
        ),
        forGenericStatement(
          [identifier('_'), identifier('v')],
          [
            callExpression(identifier('ipairs'), [
              tableConstructor([
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(1))),
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(2))),
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
                        mockNodeWithValue(babelNumericLiteral(1))
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
                          mockNodeWithValue(babelNumericLiteral(2))
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

    expect(handleSwitchStatement(source, {}, given)).toEqual(expected);
  });

  it('should convert switch statement without default case', () => {
    const given = babelSwitchStatement(babelIdentifier('foo'), [
      babelSwitchCase(babelNumericLiteral(1), [babelBreakStatement()]),
      babelSwitchCase(babelNumericLiteral(2), [babelBreakStatement()]),
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
          [variableDeclaratorValue(mockNodeWithValue(babelIdentifier('foo')))]
        ),
        forGenericStatement(
          [identifier('_'), identifier('v')],
          [
            callExpression(identifier('ipairs'), [
              tableConstructor([
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(1))),
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(2))),
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
                        mockNodeWithValue(babelNumericLiteral(1))
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
                          mockNodeWithValue(babelNumericLiteral(2))
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
    );

    expect(handleSwitchStatement(source, {}, given)).toEqual(expected);
  });

  it('should convert switch statement with fall-through cases', () => {
    const given = babelSwitchStatement(babelIdentifier('foo'), [
      babelSwitchCase(babelNumericLiteral(1), []),
      babelSwitchCase(babelNumericLiteral(2), [babelBreakStatement()]),
      babelSwitchCase(babelNumericLiteral(3), []),
      babelSwitchCase(babelNumericLiteral(4), [babelBreakStatement()]),
      babelSwitchCase(null, [babelBreakStatement()]),
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
          [variableDeclaratorValue(mockNodeWithValue(babelIdentifier('foo')))]
        ),
        forGenericStatement(
          [identifier('_'), identifier('v')],
          [
            callExpression(identifier('ipairs'), [
              tableConstructor([
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(1))),
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(2))),
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(3))),
                tableNoKeyField(mockNodeWithValue(babelNumericLiteral(4))),
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
                        mockNodeWithValue(babelNumericLiteral(1))
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
                          mockNodeWithValue(babelNumericLiteral(2))
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
                  ifStatement(
                    ifClause(
                      logicalExpression(
                        LuaLogicalExpressionOperatorEnum.OR,
                        binaryExpression(
                          identifier('v'),
                          '==',
                          mockNodeWithValue(babelNumericLiteral(3))
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
                          mockNodeWithValue(babelNumericLiteral(4))
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

    expect(handleSwitchStatement(source, {}, given)).toEqual(expected);
  });
});
