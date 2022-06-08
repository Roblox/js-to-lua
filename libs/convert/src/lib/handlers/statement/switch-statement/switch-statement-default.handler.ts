import { Expression, Statement, SwitchStatement } from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  visit,
  withInnerConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  binaryExpression,
  booleanLiteral,
  callExpression,
  forGenericStatement,
  identifier,
  ifClause,
  ifStatement,
  isBreakStatement,
  logicalExpression,
  LuaExpression,
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
import { applyTo } from 'ramda';
import {
  HandledNotDefaultCase,
  isDefaultSwitchCase,
  isNotDefaultSwitchCase,
} from './utils';

export const createSwitchStatementDefaultHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) =>
  createHandler<LuaStatement, SwitchStatement>(
    'SwitchStatement',
    (source, config, node) => {
      const enteredId = identifier('entered_');
      const breakId = identifier('break_');
      const conditionId = identifier('condition_');
      const vId = identifier('v');
      const trueLiteral = booleanLiteral(true);
      const falseLiteral = booleanLiteral(false);

      const handleCaseStatement = createHandlerFunction<
        LuaStatement,
        Statement
      >((source_, config_, node_) =>
        visit<LuaStatement, LuaStatement>(
          handleStatement(source_, config_, node_),
          (node) => {
            if (isBreakStatement(node)) {
              return nodeGroup([
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [breakId],
                  [trueLiteral]
                ),
                node,
              ]);
            }
          }
        )
      )(source, config);

      const handleDefaultCaseStatement = handleStatement(source, config);

      const notDefaultCases = node.cases
        .filter(isNotDefaultSwitchCase)
        .map<HandledNotDefaultCase>((c) => ({
          test: handleExpression(source, config, c.test),
          consequent: c.consequent.map(handleCaseStatement),
        }));
      const defaultCases = node.cases
        .filter(isDefaultSwitchCase)
        .map((c) => c.consequent.map(handleDefaultCaseStatement));

      const conditionAsStatement = asStatementReturnTypeToReturn(
        handleExpressionAsStatement(source, config, node.discriminant)
      );

      const conditionDeclaration = [
        ...conditionAsStatement.preStatements,
        variableDeclaration(
          [variableDeclaratorIdentifier(conditionId)],
          [variableDeclaratorValue(conditionAsStatement.toReturn)]
        ),
        ...conditionAsStatement.postStatements,
      ];
      return notDefaultCases.length
        ? withInnerConversionComment(
            repeatStatement(trueLiteral, [
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(enteredId),
                  variableDeclaratorIdentifier(breakId),
                ],
                [
                  variableDeclaratorValue(falseLiteral),
                  variableDeclaratorValue(falseLiteral),
                ]
              ),
              ...conditionDeclaration,
              forGenericStatement(
                [identifier('_'), vId],
                [
                  callExpression(identifier('ipairs'), [
                    tableConstructor(
                      notDefaultCases.map(({ test }) => tableNoKeyField(test))
                    ),
                  ]),
                ],
                [
                  ifStatement(
                    ifClause(
                      binaryExpression(conditionId, '==', vId),
                      nodeGroup(
                        applyTo(
                          notDefaultCases,
                          ([firstCase, ...restCases]) => [
                            ifStatement(
                              ifClause(
                                binaryExpression(vId, '==', firstCase.test),
                                nodeGroup([
                                  assignmentStatement(
                                    AssignmentStatementOperatorEnum.EQ,
                                    [enteredId],
                                    [trueLiteral]
                                  ),
                                  ...firstCase.consequent,
                                ])
                              )
                            ),
                            ...restCases.map((c) =>
                              ifStatement(
                                ifClause(
                                  logicalExpression(
                                    LuaLogicalExpressionOperatorEnum.OR,
                                    binaryExpression(vId, '==', c.test),
                                    enteredId
                                  ),
                                  nodeGroup([
                                    assignmentStatement(
                                      AssignmentStatementOperatorEnum.EQ,
                                      [enteredId],
                                      [trueLiteral]
                                    ),
                                    ...c.consequent,
                                  ])
                                )
                              )
                            ),
                          ]
                        )
                      )
                    )
                  ),
                ]
              ),
              ...defaultCases.map((c) =>
                ifStatement(
                  ifClause(unaryNegationExpression(breakId), nodeGroup(c))
                )
              ),
            ]),
            'ROBLOX comment: switch statement conversion'
          )
        : nodeGroup([]);
    }
  );
