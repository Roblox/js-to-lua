import {
  AssignmentExpression,
  binaryExpression as babelBinaryExpression,
  BinaryExpression,
  Expression,
  isArrayPattern as isBabelArrayPattern,
  isArrowFunctionExpression as isBabelArrowFunctionExpression,
  isAssignmentExpression as isBabelAssignmentExpression,
  isAssignmentPattern,
  isFunctionExpression as isBabelFunctionExpression,
  isObjectPattern as isBabelObjectPattern,
  isRestElement as isBabelRestElement,
  isTSParameterProperty,
  LVal,
  ObjectMethod,
  ObjectProperty,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  AsStatementReturnType,
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  BaseNodeAsStatementHandler,
  createAsStatementHandler,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  createExpressionStatement,
  defaultExpressionAsStatementHandler,
  getNodeSource,
  getReturnExpressions,
  isStringInferable,
  stringInferableExpression,
  unhandledIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  AssignmentStatement,
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  isStatement,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  unhandledExpression,
  UnhandledStatement,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { anyPass, equals } from 'ramda';
import { assignedToConfig } from '../../../config/assigned-to.config';
import { createExpressionAsNumericHandler } from '../../expression/handle-expression-as-numeric';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createArrayPatternDestructuringAssignmentAsStatementHandlerFunction } from './assignment-statement-array-pattern-destructuring.handler';
import { createGetAssignmentStatementOperator } from './assignment-statement-get-operator';
import { createObjectPatternDestructuringAssignmentAsStatementHandlerFunction } from './assignment-statement-object-pattern-destructuring.handler';

export const createAssignmentExpressionAsStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >,
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
): BaseNodeAsStatementHandler<
  LuaNodeGroup | AssignmentStatement,
  AssignmentExpression
> => {
  const assignmentExpressionAsStatementHandler: BaseNodeAsStatementHandler<
    LuaStatement,
    AssignmentExpression
  > = createAsStatementHandler<LuaStatement, AssignmentExpression>(
    'AssignmentExpression',
    (source, config: EmptyConfig, node): AsStatementReturnType => {
      const rightConfig = anyPass([
        isBabelFunctionExpression,
        isBabelArrowFunctionExpression,
      ])(node.right, undefined)
        ? assignedToConfig(node.left)(config)
        : config;
      const { operator, binary } = createGetAssignmentStatementOperator(
        handleExpression(source, rightConfig, node.right)
      )(node);

      if (!operator) {
        return defaultExpressionAsStatementHandler(source, config, node);
      }

      if (isBabelObjectPattern(node.left)) {
        const objectPatternDestructuringAssignmentHandler =
          createObjectPatternDestructuringAssignmentAsStatementHandlerFunction(
            handleExpression,
            handleLVal,
            handleIdentifierStrict,
            handleObjectField
          )(source, config);
        return operator === AssignmentStatementOperatorEnum.EQ
          ? objectPatternDestructuringAssignmentHandler({
              ...node,
              left: node.left,
            })
          : asStatementReturnTypeWithIdentifier(
              [
                withTrailingConversionComment(
                  unhandledStatement(),
                  `ROBLOX TODO: Unhandled object destructuring assignment for: "${node.type}" with "${operator}" operator`,
                  getNodeSource(source, node)
                ),
              ],
              [],
              unhandledIdentifier()
            );
      }

      if (isBabelArrayPattern(node.left)) {
        const arrayPatternDestructuringAssignmentHandler =
          createArrayPatternDestructuringAssignmentAsStatementHandlerFunction(
            handleExpression,
            handleLVal
          )(source, config);
        return operator === AssignmentStatementOperatorEnum.EQ
          ? arrayPatternDestructuringAssignmentHandler({
              ...node,
              left: node.left,
            })
          : asStatementReturnTypeWithIdentifier(
              [
                withTrailingConversionComment(
                  unhandledStatement(),
                  `ROBLOX TODO: Unhandled array destructuring assignment for: "${node.type}" with "${operator}" operator`,
                  getNodeSource(source, node)
                ),
              ],
              [],
              unhandledIdentifier()
            );
      }

      const leftExpression = handleLVal(source, config, node.left);

      if (binary) {
        if (
          isAssignmentPattern(node.left) ||
          isBabelRestElement(node.left) ||
          isTSParameterProperty(node.left)
        ) {
          return asStatementReturnTypeInline(
            [],
            withTrailingConversionComment(
              unhandledExpression(),
              `ROBLOX TODO: Unhandled array assignment for: "${node.type}" with "${binary}" operator and ${node.left.type} as a left value`,
              getNodeSource(source, node)
            ),
            []
          );
        }

        const rightBinaryExpression = handleBinaryExpression(
          source,
          config,
          babelBinaryExpression(binary, node.left, node.right)
        );

        const returnExpressions = getReturnExpressions(rightBinaryExpression);

        return returnExpressions.every((e) => e === rightBinaryExpression)
          ? asStatementReturnTypeWithIdentifier(
              [
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [leftExpression],
                  returnExpressions
                ),
              ],
              [],
              leftExpression
            )
          : asStatementReturnTypeWithIdentifier(
              [
                isStatement(rightBinaryExpression)
                  ? rightBinaryExpression
                  : createExpressionStatement(
                      source,
                      node,
                      rightBinaryExpression
                    ),
                assignmentStatement(
                  AssignmentStatementOperatorEnum.EQ,
                  [leftExpression],
                  returnExpressions
                ),
              ],
              [],
              leftExpression
            );
      }

      const rightExpression = [
        AssignmentStatementOperatorEnum.ADD,
        AssignmentStatementOperatorEnum.SUB,
        AssignmentStatementOperatorEnum.DIV,
        AssignmentStatementOperatorEnum.MUL,
        AssignmentStatementOperatorEnum.REMAINDER,
      ].some(equals(operator))
        ? asStatementReturnTypeInline(
            [],
            createExpressionAsNumericHandler(handleExpression)(
              source,
              rightConfig,
              node.right
            ),
            []
          )
        : handleExpressionAsStatement(source, rightConfig, node.right);

      if (isBabelAssignmentExpression(node.right)) {
        const rightAssignmentStatement =
          assignmentExpressionAsStatementHandler.handler(
            source,
            rightConfig,
            node.right
          );

        const { preStatements, postStatements, toReturn } =
          asStatementReturnTypeToReturn(rightAssignmentStatement);

        const isRightStringInferable = isStringInferable(toReturn);

        return isRightStringInferable &&
          operator === AssignmentStatementOperatorEnum.ADD
          ? asStatementReturnTypeWithIdentifier(
              [
                ...preStatements,
                assignmentStatement(
                  AssignmentStatementOperatorEnum.CONCAT,
                  [stringInferableExpression(leftExpression)],
                  [toReturn]
                ),
              ],
              postStatements,
              stringInferableExpression(leftExpression)
            )
          : asStatementReturnTypeWithIdentifier(
              [
                ...preStatements,
                assignmentStatement(operator, [leftExpression], [toReturn]),
              ],
              postStatements,
              leftExpression
            );
      }

      const leftExpression_ =
        operator === AssignmentStatementOperatorEnum.CONCAT
          ? stringInferableExpression(leftExpression)
          : leftExpression;

      const { preStatements, postStatements, toReturn } =
        asStatementReturnTypeToReturn(rightExpression);

      return asStatementReturnTypeWithIdentifier(
        [
          ...preStatements,
          assignmentStatement(operator, [leftExpression_], [toReturn]),
        ],
        postStatements,
        leftExpression_
      );
    }
  );
  return assignmentExpressionAsStatementHandler;
};
