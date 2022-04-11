import {
  ArrayPattern,
  AssignmentExpression,
  binaryExpression as babelBinaryExpression,
  BinaryExpression,
  Expression,
  isArrayPattern as isBabelArrayPattern,
  isAssignmentExpression as isBabelAssignmentExpression,
  isAssignmentPattern,
  isObjectPattern as isBabelObjectPattern,
  isRestElement as isBabelRestElement,
  isTSParameterProperty,
  LVal,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultExpressionHandler,
  getNodeSource,
  getReturnExpressions,
  isStringInferable,
  stringInferableExpression,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaTableKeyField,
  nodeGroup,
  UnhandledStatement,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { equals } from 'ramda';
import { createExpressionAsNumericHandler } from '../../expression/handle-expression-as-numeric';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createArrayPatternDestructuringAssignmentHandlerFunction } from './assignment-statement-array-pattern-destructuring.handler';
import { createGetAssignmentStatementOperator } from './assignment-statement-get-operator';
import { createObjectPatternDestructuringAssignmentHandlerFunction } from './assignment-statement-object-pattern-destructuring.handler';

export const createAssignmentStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleBinaryExpression: HandlerFunction<
    LuaBinaryExpression | LuaCallExpression | UnhandledStatement,
    BinaryExpression
  >
) => {
  const assignmentStatementHandler: BaseNodeHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  > = createHandler(
    'AssignmentExpression',
    (source, config: EmptyConfig, node: AssignmentExpression) => {
      const { operator, binary } = createGetAssignmentStatementOperator(
        handleExpression
      )(source, config, node);

      if (!operator) {
        return defaultExpressionHandler(source, config, node);
      }

      if (isBabelObjectPattern(node.left)) {
        const objectPatternDestructuringAssignmentHandler =
          createObjectPatternDestructuringAssignmentHandlerFunction(
            handleExpression,
            handleLVal,
            handleIdentifierStrict,
            handleObjectField
          )(source, config);
        return operator === AssignmentStatementOperatorEnum.EQ
          ? objectPatternDestructuringAssignmentHandler(
              node as AssignmentExpression & { left: ObjectPattern }
            )
          : withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled object destructuring assignment for: "${node.type}" with "${operator}" operator`,
              getNodeSource(source, node)
            );
      } else if (isBabelArrayPattern(node.left)) {
        const arrayPatternDestructuringAssignmentHandler =
          createArrayPatternDestructuringAssignmentHandlerFunction(
            handleExpression,
            handleLVal
          )(source, config);
        return operator === AssignmentStatementOperatorEnum.EQ
          ? arrayPatternDestructuringAssignmentHandler(
              node as AssignmentExpression & { left: ArrayPattern }
            )
          : withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled array destructuring assignment for: "${node.type}" with "${operator}" operator`,
              getNodeSource(source, node)
            );
      }
      const leftExpression = handleLVal(source, config, node.left);

      if (binary) {
        if (
          isAssignmentPattern(node.left) ||
          isBabelRestElement(node.left) ||
          isTSParameterProperty(node.left)
        ) {
          return withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled array assignment for: "${node.type}" with "${binary}" operator and ${node.left.type} as a left value`,
            getNodeSource(source, node)
          );
        }

        const rightBinaryExpression = handleBinaryExpression(
          source,
          config,
          babelBinaryExpression(binary, node.left, node.right)
        );

        const returnExpressions = getReturnExpressions(rightBinaryExpression);

        return returnExpressions.every((e) => e === rightBinaryExpression)
          ? assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [leftExpression],
              returnExpressions
            )
          : nodeGroup([
              rightBinaryExpression,
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [leftExpression],
                returnExpressions
              ),
            ]);
      }

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

        const isRightStringInferable =
          returnExpressions.every(isStringInferable);

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
    }
  );
  return assignmentStatementHandler;
};
