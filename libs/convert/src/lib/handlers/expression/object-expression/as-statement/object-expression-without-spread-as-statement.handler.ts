import { ObjectExpression } from '@babel/types';
import {
  AsStatementHandlerFunction,
  asStatementReturnTypeInline,
  asStatementReturnTypeWithIdentifier,
  createAsStatementHandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  generateUniqueIdentifier,
  isNotPure,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaStatement,
  LuaTableConstructor,
  LuaTableKeyField,
  tableConstructor,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { findLastIndex } from 'ramda';
import { NoSpreadObjectProperty } from '../object-expression.types';
import {
  extractTableConstructorField,
  SingleFieldTableConstructorToReturn,
} from './single-field-table-constructor-to-return';

export const createObjectExpressionWithoutSpreadAsStatementHandler = (
  objectFieldHandlerAsStatementFunction: AsStatementHandlerFunction<
    LuaStatement,
    NoSpreadObjectProperty,
    LuaTableConstructor<[LuaTableKeyField]>
  >
) => {
  return createAsStatementHandlerFunction<
    LuaStatement,
    ObjectExpression,
    LuaTableConstructor
  >(
    (source, config, expression) => {
      const handleObjectField = objectFieldHandlerAsStatementFunction(
        source,
        config
      );
      const elementsAsStatement_ = expression.properties
        .map(handleObjectField)
        .map(asStatementReturnTypeToReturn);

      const lastIndexToHoist = findLastIndex(
        ({ preStatements, postStatements }) =>
          preStatements.length > 0 || postStatements.length > 0,
        elementsAsStatement_
      );

      const elementsAsStatement = elementsAsStatement_.map(
        (el, index, arr): SingleFieldTableConstructorToReturn => {
          const field = extractTableConstructorField(el);
          if (
            index <= lastIndexToHoist &&
            (isNotPure(field.value) || lastIndexToHoist > 0)
          ) {
            const id = identifier(
              generateUniqueIdentifier([], `refProp${index}`)
            );
            return asStatementReturnTypeToReturn(
              asStatementReturnTypeWithIdentifier(
                [
                  ...arr[index].preStatements,
                  variableDeclaration(
                    [variableDeclaratorIdentifier(id)],
                    [variableDeclaratorValue(field.value)]
                  ),
                  ...arr[index].postStatements,
                ],
                [],
                tableConstructor([
                  {
                    ...field,
                    value: id,
                  },
                ])
              )
            );
          }
          return el;
        }
      );

      const preStatements = elementsAsStatement
        .map(({ preStatements }) => preStatements)
        .flat();
      const postStatements = elementsAsStatement
        .map(({ postStatements }) => postStatements)
        .flat();
      const args = elementsAsStatement.map(extractTableConstructorField);
      return asStatementReturnTypeInline(
        preStatements,
        tableConstructor(args),
        postStatements
      );
    },
    { skipComments: true }
  );
};
