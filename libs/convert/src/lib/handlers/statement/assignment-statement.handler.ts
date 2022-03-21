import {
  ArrayPattern,
  AssignmentExpression,
  binaryExpression as babelBinaryExpression,
  BinaryExpression,
  Expression,
  isArrayPattern as isBabelArrayPattern,
  isAssignmentExpression as isBabelAssignmentExpression,
  isAssignmentPattern,
  isIdentifier as isBabelIdentifier,
  isObjectExpression,
  isObjectPattern as isBabelObjectPattern,
  isObjectProperty,
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
  blockStatement,
  identifier,
  LuaBinaryExpression,
  LuaCallExpression,
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
} from '@js-to-lua/lua-types';
import { isTruthy } from '@js-to-lua/shared-utils';
import { equals } from 'ramda';
import {
  createArrayPatternDestructuringHandler,
  hasUnhandledArrayDestructuringParam,
} from '../expression/array-pattern-destructuring.handler';
import { createExpressionAsNumericHandler } from '../expression/handle-expression-as-numeric';
import {
  createObjectPatternDestructuringHandler,
  hasUnhandledObjectDestructuringParam,
} from '../object-pattern-destructuring.handler';

export const createAssignmentStatementHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleBinaryExpression: HandlerFunction<
    LuaBinaryExpression | LuaCallExpression | UnhandledStatement,
    BinaryExpression
  >
) => {
  const getAssignmentStatementOperator = (
    source: string,
    config: EmptyConfig,
    node: AssignmentExpression
  ): {
    operator?: AssignmentStatementOperatorEnum;
    binary?: BinaryExpression['operator'];
  } => {
    const rightExpression = handleExpression(source, config, node.right);
    switch (node.operator) {
      case '=':
        return { operator: AssignmentStatementOperatorEnum.EQ };
      case '+=':
        return isStringInferable(rightExpression)
          ? { operator: AssignmentStatementOperatorEnum.CONCAT }
          : { operator: AssignmentStatementOperatorEnum.ADD };
      case '-=':
        return { operator: AssignmentStatementOperatorEnum.SUB };
      case '*=':
        return { operator: AssignmentStatementOperatorEnum.MUL };
      case '/=':
        return { operator: AssignmentStatementOperatorEnum.DIV };
      case '%=':
        return { operator: AssignmentStatementOperatorEnum.REMAINDER };
      case '&=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '&',
        };
      case '|=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '|',
        };
      case '^=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '^',
        };
      case '>>>=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '>>>',
        };
      case '>>=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '>>',
        };
      case '<<=':
        return {
          operator: AssignmentStatementOperatorEnum.EQ,
          binary: '<<',
        };
    }
    return {};
  };

  const assignmentStatementHandler: BaseNodeHandler<
    LuaNodeGroup | AssignmentStatement,
    AssignmentExpression
  > = createHandler(
    'AssignmentExpression',
    (source, config: EmptyConfig, node: AssignmentExpression) => {
      const { operator, binary } = getAssignmentStatementOperator(
        source,
        config,
        node
      );

      if (!operator) {
        return defaultExpressionHandler(source, config, node);
      }

      const objectPatternDestructuringHandler =
        createObjectPatternDestructuringHandler(
          handleExpression,
          handleLVal,
          handleObjectField
        );

      const arrayPatternDestructuringHandler =
        createArrayPatternDestructuringHandler(handleExpression);

      if (isBabelObjectPattern(node.left)) {
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
        return operator === AssignmentStatementOperatorEnum.EQ
          ? nodeGroup(
              arrayPatternDestructuringAssignmentHandler(
                node as AssignmentExpression & { left: ArrayPattern }
              )
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

      function objectPatternDestructuringAssignmentHandler(
        node: AssignmentExpression & { left: ObjectPattern }
      ) {
        if (
          hasUnhandledObjectDestructuringParam(
            node.left.properties.filter((property) =>
              isObjectProperty(property)
            ) as ObjectProperty[]
          )
        ) {
          return withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled AssignmentStatement when one of the object properties is not supported`,
            getNodeSource(source, node)
          );
        }

        if (isObjectExpression(node.right)) {
          const helperIdentifier = identifier(`ref`);
          const destructured = objectPatternDestructuringHandler(
            source,
            config,
            helperIdentifier,
            node.left.properties
          );
          return blockStatement([
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
            getNodeSource(source, node)
          );
        }
      }

      function arrayPatternDestructuringAssignmentHandler(
        node: AssignmentExpression & { left: ArrayPattern }
      ): (AssignmentStatement | UnhandledStatement)[] {
        if (
          hasUnhandledArrayDestructuringParam(
            node.left.elements.filter(isTruthy)
          )
        ) {
          return [
            withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX TODO: Unhandled node for ArrayPattern assignment when one of the elements is not supported`,
              getNodeSource(source, node)
            ),
          ];
        }

        return arrayPatternDestructuringHandler(
          source,
          config,
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
