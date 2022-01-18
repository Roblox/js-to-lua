import {
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../../types';
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
  withInnerConversionComment,
} from '@js-to-lua/lua-types';
import {
  Expression,
  Statement,
  SwitchCase,
  SwitchStatement,
} from '@babel/types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { visit } from '../../utils/visitor';

type DefaultSwitchCase = Omit<SwitchCase, 'test'> & { test: null };
type NotDefaultSwitchCase = Omit<SwitchCase, 'test'> & { test: Expression };
const isDefaultSwitchCase = (node: SwitchCase): node is DefaultSwitchCase =>
  !isNotDefaultSwitchCase(node);
const isNotDefaultSwitchCase = (
  node: SwitchCase
): node is NotDefaultSwitchCase => isTruthy(node.test);

interface HandledNotDefaultCase {
  test: LuaExpression;
  consequent: LuaStatement[];
}

export const createSwitchStatementHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>
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

      return withInnerConversionComment(
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
          variableDeclaration(
            [variableDeclaratorIdentifier(conditionId)],
            [
              variableDeclaratorValue(
                handleExpression(source, config, node.discriminant)
              ),
            ]
          ),
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
                    applyTo(notDefaultCases, ([firstCase, ...restCases]) => [
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
                    ])
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
      );
    }
  );
