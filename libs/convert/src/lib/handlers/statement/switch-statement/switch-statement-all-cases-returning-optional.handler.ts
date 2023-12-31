import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createOptionalHandlerFunction,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  unwrapStatements,
  visit,
  withInnerConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  binaryExpression,
  booleanLiteral,
  elseClause,
  elseifClause,
  identifier,
  ifClause,
  ifStatement,
  isBreakStatement,
  logicalExpression,
  LuaExpression,
  LuaIfStatement,
  LuaLogicalExpressionOperatorEnum,
  LuaStatement,
  nodeGroup,
  repeatStatement,
  unhandledExpression,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo, dropLast, last } from 'ramda';
import { isDefaultSwitchCase, isNotDefaultSwitchCase } from './utils';

export const createSwitchStatementAllCasesReturningOptionalHandler = (
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >
) => {
  return createOptionalHandlerFunction<LuaStatement, Babel.SwitchStatement>(
    (source, config, node) => {
      const notDefaultCases = node.cases.filter(isNotDefaultSwitchCase);
      const splitCases = notDefaultCases.reduce(groupCases, []);

      if (
        splitCases.every((splitCase) => {
          const lastCase = last(splitCase);
          return lastCase && isCaseReturningOrBreaking(lastCase);
        })
      ) {
        const handleCaseStatement = handleStatement(source, config);

        const [firstCase, ...remainingCases] = notDefaultCases
          .reduce(groupCases, [])
          .map((c) => {
            const tests = (Array.isArray(c) ? c : [c]).map((singleCase) =>
              handleExpression(source, config, singleCase.test!)
            );

            const consequent = (Array.isArray(c) ? last(c)! : c).consequent.map(
              handleCaseStatement
            );

            return {
              tests,
              consequent,
            };
          });
        const defaultCases = node.cases
          .filter(isDefaultSwitchCase)
          .map((c) => c.consequent.map(handleCaseStatement));

        const conditionId = identifier('condition_');

        const defaultCase = defaultCases[0];

        const switchCaseBody = ifStatement(
          ifClause(
            createLogicalOrExpression(
              firstCase.tests.map((test) =>
                binaryExpression(conditionId, '==', test)
              )
            ),
            nodeGroup(firstCase.consequent.map(unwrapStatements).flat())
          ),
          remainingCases.map(({ tests, consequent }) =>
            elseifClause(
              createLogicalOrExpression(
                tests.map((test) => binaryExpression(conditionId, '==', test))
              ),
              nodeGroup(consequent.map(unwrapStatements).flat())
            )
          ),
          defaultCase?.length
            ? elseClause(nodeGroup(defaultCase.map(unwrapStatements).flat()))
            : undefined
        );

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
        return firstCase
          ? needsWrappingLoop(node, switchCaseBody)
            ? withInnerConversionComment(
                repeatStatement(booleanLiteral(true), [
                  ...conditionDeclaration,
                  switchCaseBody,
                ]),
                'ROBLOX comment: switch statement conversion'
              )
            : nodeGroup([
                ...conditionDeclaration,
                visit<LuaStatement, LuaStatement>(switchCaseBody, (node) => {
                  if (isBreakStatement(node)) {
                    return nodeGroup([]);
                  }
                }),
              ])
          : undefined;
      }
    }
  );
};

const createLogicalOrExpression = (
  expressions: LuaExpression[]
): LuaExpression =>
  expressions.length === 0
    ? unhandledExpression()
    : expressions.length === 1
    ? expressions[0]
    : logicalExpression(
        LuaLogicalExpressionOperatorEnum.OR,
        createLogicalOrExpression(dropLast(1, expressions)),
        last(expressions)!
      );

function isLastStatementReturnOrBreak(statements: Babel.Statement[]) {
  return applyTo(
    last(statements),
    (lastStatement) =>
      (!!lastStatement &&
        (Babel.isReturnStatement(lastStatement) ||
          Babel.isBreakStatement(lastStatement))) ||
      Babel.isContinueStatement(lastStatement)
  );
}

const groupCases = (
  splitResult: Babel.SwitchCase[][],
  switchCase: Babel.SwitchCase,
  index: number,
  arr: Babel.SwitchCase[]
) => {
  const lastResult = last(splitResult);
  if (lastResult && !isNotFallThroughCase(arr[index - 1])) {
    lastResult.push(switchCase);
  } else {
    splitResult.push([switchCase]);
  }
  return splitResult;
};

const isNotFallThroughCase = (
  switchCase: Babel.SwitchCase
): switchCase is Babel.SwitchCase & {
  consequent:
    | NonEmptyArray<LuaStatement>
    | [Babel.BlockStatement & { body: NonEmptyArray<LuaStatement> }];
} => {
  return (
    (switchCase.consequent.length &&
      switchCase.consequent.some(
        (statement) => !Babel.isBlockStatement(statement)
      )) ||
    (switchCase.consequent.length === 1 &&
      applyTo(
        switchCase.consequent[0],
        (statement) =>
          Babel.isBlockStatement(statement) && !!statement.body.length
      ))
  );
};

const isCaseReturningOrBreaking = (switchCase: Babel.SwitchCase): boolean => {
  return (
    isDefaultSwitchCase(switchCase) ||
    isLastStatementReturnOrBreak(switchCase.consequent) ||
    (switchCase.consequent.length === 1 &&
      applyTo(
        switchCase.consequent[0],
        (statement) =>
          Babel.isBlockStatement(statement) &&
          isLastStatementReturnOrBreak(statement.body)
      ))
  );
};

const needsWrappingLoop = (
  node: Babel.SwitchStatement,
  switchCaseBody: LuaIfStatement
) => {
  const immediateBreakStatementsCount = node.cases
    .map((switchCase) =>
      switchCase.consequent.filter((statement) =>
        Babel.isBreakStatement(statement)
      )
    )
    .flat().length;

  const innerBreakStatementsCount =
    calculateInnerBreakStatementsCount(switchCaseBody);

  return innerBreakStatementsCount > immediateBreakStatementsCount;
};

const calculateInnerBreakStatementsCount = (
  statement: LuaStatement
): number => {
  let breakCount = 0;

  visit(statement, (node) => {
    if (isBreakStatement(node)) {
      breakCount++;
    }
  });

  return breakCount;
};
