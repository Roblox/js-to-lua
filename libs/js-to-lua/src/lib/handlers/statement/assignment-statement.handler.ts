import { BaseNodeHandler, createHandler, HandlerFunction } from '../../types';
import {
  AssignmentStatement,
  assignmentStatement,
  identifier,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaTableKeyField,
  nodeGroup,
  UnhandledStatement,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  AssignmentExpression,
  Expression,
  isAssignmentExpression as isBabelAssignmentExpression,
  LVal,
  ObjectPattern,
  isObjectExpression,
  isIdentifier as isBabelIdentifier,
  isObjectPattern as isBabelObjectPattern,
  isRestElement as isBabelRestElement,
  isArrayPattern as isBabelArrayPattern,
  ArrayPattern,
  ObjectMethod,
  ObjectProperty,
} from '@babel/types';
import { defaultExpressionHandler } from '../../utils/default-handlers';
import { getReturnExpressions } from '../../utils/get-return-expressions';
import { createObjectPatternDestructuringHandler } from '../object-pattern-destructuring.handler';
import { isTruthy } from '@js-to-lua/shared-utils';
import { handleArrayPatternDestructuring } from '../array-pattern-destructuring.handler';

export const createAssignmentStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
) => {
  const assignmentStatementHandler: BaseNodeHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  > = createHandler(
    'AssignmentExpression',
    (source, config, node: AssignmentExpression) => {
      const objectPatternDestructuringHandler = createObjectPatternDestructuringHandler(
        handleExpression,
        handleLVal,
        handleObjectField
      );

      if (isBabelObjectPattern(node.left)) {
        return objectPatternDestructuringAssignmentHandler(
          node as AssignmentExpression & { left: ObjectPattern }
        );
      } else if (isBabelArrayPattern(node.left)) {
        return nodeGroup(
          arrayPatternDestructuringAssignmentHandler(
            node as AssignmentExpression & { left: ArrayPattern }
          )
        );
      }
      const leftExpression = handleLVal(source, config, node.left);
      const rightExpression = handleExpression(source, config, node.right);

      if (isBabelAssignmentExpression(node.right)) {
        const rightAssignmentStatement = assignmentStatementHandler.handler(
          source,
          config,
          node.right
        );

        const returnExpressions = getReturnExpressions(
          rightAssignmentStatement
        );

        return nodeGroup([
          rightAssignmentStatement,
          assignmentStatement([leftExpression], returnExpressions),
        ]);
      }

      switch (node.operator) {
        case '=':
          return assignmentStatement([leftExpression], [rightExpression]);
        default:
          return defaultExpressionHandler(source, config, node);
      }

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
            item.ids.map((id) => handleLVal(source, config, id)),
            item.values.filter(isTruthy)
          )
        );
      }
    }
  );
  return assignmentStatementHandler;
};
