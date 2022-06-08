import { Expression } from '@babel/types';
import {
  AsStatementReturnType,
  isAsStatementReturnTypeInline,
  isAsStatementReturnTypeStandaloneOrInline,
  isAsStatementReturnTypeWithIdentifier,
} from '@js-to-lua/handler-utils';
import {
  callExpression,
  functionExpression,
  identifier,
  LuaExpression,
  LuaStatement,
  nodeGroup,
  returnStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { createExpressionStatement } from './create-expression-statement';
import { generateUniqueIdentifier } from './generate-unique-identifier';

export const asStatementReturnTypeToStatement = (
  source: string,
  babelExpression: Expression,
  value: AsStatementReturnType
): LuaStatement => {
  return isAsStatementReturnTypeInline(value)
    ? nodeGroup([
        ...value.preStatements,
        createExpressionStatement(
          source,
          babelExpression,
          value.inlineExpression
        ),
        ...value.postStatements,
      ])
    : isAsStatementReturnTypeWithIdentifier(value)
    ? nodeGroup([...value.preStatements, ...value.postStatements])
    : nodeGroup([
        ...value.standalone.preStatements,
        value.standalone.statement,
        ...value.standalone.postStatements,
      ]);
};

export const asStatementReturnTypeToReturnStatement = (
  value: AsStatementReturnType
): LuaStatement[] => {
  if (isAsStatementReturnTypeStandaloneOrInline(value)) {
    return [
      ...value.inline.preStatements,
      ...value.inline.postStatements,
      returnStatement(value.inline.identifier),
    ];
  }

  const resultExpression = isAsStatementReturnTypeInline(value)
    ? value.inlineExpression
    : value.identifier;

  const returnId = identifier(generateUniqueIdentifier([], 'ref'));

  return value.postStatements.length
    ? [
        ...value.preStatements,
        variableDeclaration(
          [variableDeclaratorIdentifier(returnId)],
          [variableDeclaratorValue(resultExpression)]
        ),
        ...value.postStatements,
        returnStatement(returnId),
      ]
    : [...value.preStatements, returnStatement(resultExpression)];
};

export const asStatementReturnTypeToExpression = (
  value: AsStatementReturnType
): LuaExpression => {
  return isAsStatementReturnTypeInline(value) &&
    !value.preStatements.length &&
    !value.postStatements.length
    ? value.inlineExpression
    : callExpression(
        functionExpression(
          [],
          nodeGroup(asStatementReturnTypeToReturnStatement(value))
        ),
        []
      );
};

export type AsStatementReturnValue<
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
> = { preStatements: R[]; postStatements: R[]; toReturn: I };

export const asStatementReturnTypeToReturn = <
  R extends LuaStatement = LuaStatement,
  I extends LuaExpression = LuaExpression
>(
  value: AsStatementReturnType<R, I>
): AsStatementReturnValue<R, I> => {
  const toReturn = isAsStatementReturnTypeInline(value)
    ? value.inlineExpression
    : isAsStatementReturnTypeWithIdentifier(value)
    ? value.identifier
    : value.inline.identifier;

  const { preStatements, postStatements } =
    isAsStatementReturnTypeStandaloneOrInline(value) ? value.inline : value;

  return {
    preStatements,
    postStatements,
    toReturn,
  };
};
