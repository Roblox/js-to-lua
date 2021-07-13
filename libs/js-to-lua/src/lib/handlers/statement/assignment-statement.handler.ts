import {
  BaseNodeHandler,
  createHandler,
  EmptyConfig,
  HandlerFunction,
} from '../../types';
import {
  AssignmentStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  identifier,
  isStringInferable,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaTableKeyField,
  nodeGroup,
  stringInferableExpression,
  UnhandledStatement,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  ArrayPattern,
  AssignmentExpression,
  Expression,
  isArrayPattern as isBabelArrayPattern,
  isAssignmentExpression as isBabelAssignmentExpression,
  isIdentifier as isBabelIdentifier,
  isObjectExpression,
  isObjectPattern as isBabelObjectPattern,
  isRestElement as isBabelRestElement,
  LVal,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
} from '@babel/types';
import { defaultExpressionHandler } from '../../utils/default-handlers';
import { getReturnExpressions } from '../../utils/get-return-expressions';
import { createObjectPatternDestructuringHandler } from '../object-pattern-destructuring.handler';
import { isTruthy } from '@js-to-lua/shared-utils';
import { handleArrayPatternDestructuring } from '../array-pattern-destructuring.handler';
import { createExpressionAsNumericHandler } from '../expression/handle-expression-as-numeric';
import { equals } from 'ramda';

export const createAssignmentStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
) => {
  const getAssignmentStatementOperator = (
    source: string,
    config: EmptyConfig,
    node: AssignmentExpression
  ) => {
    const rightExpression = handleExpression(source, config, node.right);
    switch (node.operator) {
      case '=':
        return AssignmentStatementOperatorEnum.EQ;
      case '+=':
        return isStringInferable(rightExpression)
          ? AssignmentStatementOperatorEnum.CONCAT
          : AssignmentStatementOperatorEnum.ADD;
      case '-=':
        return AssignmentStatementOperatorEnum.SUB;
      case '*=':
        return AssignmentStatementOperatorEnum.MUL;
      case '/=':
        return AssignmentStatementOperatorEnum.DIV;
      case '%=':
        return AssignmentStatementOperatorEnum.REMAINDER;
    }
  };

  const assignmentStatementHandler: BaseNodeHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  > = createHandler(
    'AssignmentExpression',
    (source, config: EmptyConfig, node: AssignmentExpression) => {
      const operator = getAssignmentStatementOperator(source, config, node);

      if (!operator) {
        return defaultExpressionHandler(source, config, node);
      }

      const objectPatternDestructuringHandler = createObjectPatternDestructuringHandler(
        handleExpression,
        handleLVal,
        handleObjectField
      );

      if (isBabelObjectPattern(node.left)) {
        return operator === AssignmentStatementOperatorEnum.EQ
          ? objectPatternDestructuringAssignmentHandler(
              node as AssignmentExpression & { left: ObjectPattern }
            )
          : withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled object destructuring assignment for: "${node.type}" with "${operator}" operator`,
              source.slice(node.start || 0, node.end || 0)
            );
      } else if (isBabelArrayPattern(node.left)) {
        return operator === AssignmentStatementOperatorEnum.EQ
          ? nodeGroup(
              arrayPatternDestructuringAssignmentHandler(
                node as AssignmentExpression & { left: ArrayPattern }
              )
            )
          : withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled array destructuring assignment for: "${node.type}" with "${operator}" operator`,
              source.slice(node.start || 0, node.end || 0)
            );
      }

      const leftExpression = handleLVal(source, config, node.left);
      const rightExpression = [
        AssignmentStatementOperatorEnum.ADD,
        AssignmentStatementOperatorEnum.SUB,
        AssignmentStatementOperatorEnum.DIV,
        AssignmentStatementOperatorEnum.MUL,
        AssignmentStatementOperatorEnum.REMAINDER,
      ].some(equals(operator))
        ? createExpressionAsNumericHandler(handleExpression)(
            source,
            config,
            node.right
          )
        : handleExpression(source, config, node.right);

      if (isBabelAssignmentExpression(node.right)) {
        const rightAssignmentStatement = assignmentStatementHandler.handler(
          source,
          config,
          node.right
        );

        const returnExpressions = getReturnExpressions(
          rightAssignmentStatement
        );

        const isRightStringInferable = returnExpressions.every(
          isStringInferable
        );

        return isRightStringInferable &&
          operator === AssignmentStatementOperatorEnum.ADD
          ? nodeGroup([
              rightAssignmentStatement,
              assignmentStatement(
                AssignmentStatementOperatorEnum.CONCAT,
                [stringInferableExpression(leftExpression)],
                returnExpressions
              ),
            ])
          : nodeGroup([
              rightAssignmentStatement,
              assignmentStatement(
                operator,
                [leftExpression],
                returnExpressions
              ),
            ]);
      }

      return operator === AssignmentStatementOperatorEnum.CONCAT
        ? assignmentStatement(
            operator,
            [stringInferableExpression(leftExpression)],
            [rightExpression]
          )
        : assignmentStatement(operator, [leftExpression], [rightExpression]);

      function objectPatternDestructuringAssignmentHandler(
        node: AssignmentExpression & { left: ObjectPattern }
      ) {
        if (isObjectExpression(node.right)) {
          const helperIdentifier = identifier(`ref`);
          const destructured = objectPatternDestructuringHandler(
            source,
            config,
            helperIdentifier,
            node.left.properties
          );
          return nodeGroup([
            variableDeclaration(
              [variableDeclaratorIdentifier(helperIdentifier)],
              [
                variableDeclaratorValue(
                  handleExpression(source, config, node.right)
                ),
              ]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              destructured.ids,
              destructured.values.filter(isTruthy)
            ),
          ]);
        } else if (isBabelIdentifier(node.right)) {
          const destructured = objectPatternDestructuringHandler(
            source,
            config,
            handleExpression(source, config, node.right),
            node.left.properties
          );
          return assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            destructured.ids,
            destructured.values.filter(isTruthy)
          );
        } else {
          return withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled object destructuring assignment for: "${node.right.type}"`,
            source.slice(node.start || 0, node.end || 0)
          );
        }
      }

      function arrayPatternDestructuringAssignmentHandler(
        node: AssignmentExpression & { left: ArrayPattern }
      ): (AssignmentStatement | UnhandledStatement)[] {
        if (
          node.left.elements.some(
            (el) =>
              !(
                isBabelIdentifier(el) ||
                isBabelRestElement(el) ||
                isBabelArrayPattern(el)
              )
          )
        ) {
          return [
            withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled node for type: ArrayPattern variable declaration when one of the elements is not an Identifier or RestElement`,
              source.slice(node.start || 0, node.end || 0)
            ),
          ];
        }

        return handleArrayPatternDestructuring(
          node.left.elements.filter(isTruthy),
          handleExpression(source, config, node.right)
        ).map((item) =>
          assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            item.ids.map((id) => handleLVal(source, config, id)),
            item.values.filter(isTruthy)
          )
        );
      }
    }
  );
  return assignmentStatementHandler;
};
