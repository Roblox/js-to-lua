import {
  CallExpression,
  Expression,
  isExpression,
  isSpreadElement,
  Node,
  SpreadElement,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  AsStatementReturnType,
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  generateUniqueIdentifier,
  isNotPure,
  tableUnpackCall,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaExpression,
  LuaStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { splitBy } from '@js-to-lua/shared-utils';
import { findLastIndex } from 'ramda';
import { createSpreadElementPropertiesHandler } from '../spread-element-properties.handler';

export const createCallExpressionArgumentsAsStatementHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >
) => {
  const spreadElementPropertiesHandler =
    createSpreadElementPropertiesHandler(handleExpression);
  return (
    source: string,
    config: EmptyConfig,
    args: CallExpression['arguments']
  ): AsStatementReturnType[] => {
    const isExpressionOrSpreadElement = (
      nodes: Array<Node>
    ): nodes is Array<Expression | SpreadElement> =>
      nodes.every((node) => isExpression(node) || isSpreadElement(node));

    if (
      isExpressionOrSpreadElement(args) &&
      args.some((arg) => isSpreadElement(arg))
    ) {
      const propertiesGroups = args.reduce(
        splitBy<Expression | SpreadElement, SpreadElement>(isSpreadElement),
        []
      );

      const expressions = spreadElementPropertiesHandler(
        source,
        { ...config, forceConcat: false },
        propertiesGroups
      );
      return (Array.isArray(expressions) ? expressions : [expressions])
        .map((node, index, arr) =>
          index === arr.length - 1 ? tableUnpackCall(node) : node
        )
        .map((e) => asStatementReturnTypeInline([], e, []));
    }
    const toExpressionAsStatement = handleExpressionAsStatement(source, config);
    const argsAsStatements = args
      .map(toExpressionAsStatement)
      .map(asStatementReturnTypeToReturn);

    const lastIndexToHoist = findLastIndex(
      ({ preStatements, postStatements }) =>
        preStatements.length > 0 || postStatements.length > 0,
      argsAsStatements
    );

    const elementsAsStatement = argsAsStatements.map((el, index, arr) => {
      if (
        index < lastIndexToHoist &&
        (isNotPure(arr[index].toReturn) || lastIndexToHoist > 0)
      ) {
        const id = identifier(generateUniqueIdentifier([], `refArg${index}`));
        return asStatementReturnTypeToReturn(
          asStatementReturnTypeWithIdentifier(
            [
              ...arr[index].preStatements,
              variableDeclaration(
                [variableDeclaratorIdentifier(id)],
                [variableDeclaratorValue(el.toReturn)]
              ),
              ...arr[index].postStatements,
            ],
            [],
            id
          )
        );
      }
      return el;
    });

    return elementsAsStatement.map(
      ({ preStatements, postStatements, toReturn }) =>
        asStatementReturnTypeInline(preStatements, toReturn, postStatements)
    );
  };
};
