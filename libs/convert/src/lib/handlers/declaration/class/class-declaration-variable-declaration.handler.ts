import * as Babel from '@babel/types';
import {
  createHandlerFunction,
  EmptyConfig,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  identifier,
  LuaExpression,
  LuaIdentifier,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  memberExpression,
  nodeGroup,
  tableConstructor,
  tableNameKeyField,
  typeAny,
  typeCastExpression,
  typeIntersection,
  typeReference,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { createTypeParameterDeclarationHandler } from '../../type/type-parameter-declaration.handler';
import {
  createClassIdentifierPrivate,
  createClassIdentifierStatics,
  hasNonPublicMembers,
} from './class-declaration.utils';

export const createClassVariableDeclarationHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  return createHandlerFunction<
    LuaNodeGroup<[LuaStatement, ...Array<LuaStatement>]>,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, node) => {
      const { classIdentifier } = config;

      const classIdentifierStatics =
        createClassIdentifierStatics(classIdentifier);

      const superClass = node.superClass
        ? handleExpression(source, config, node.superClass)
        : undefined;

      const handleTypeParameterDeclaration =
        createTypeParameterDeclarationHandler(handleType).handler(
          source,
          config
        );

      const genericTypeParametersDeclaration =
        node.typeParameters &&
        !Babel.isNoop(node.typeParameters) &&
        node.typeParameters.params.length
          ? handleTypeParameterDeclaration(node.typeParameters).params.map(() =>
              typeAny()
            )
          : undefined;

      const publicDeclaratorValue = typeCastExpression(
        superClass
          ? typeCastExpression(
              callExpression(identifier('setmetatable'), [
                tableConstructor(),
                tableConstructor([
                  tableNameKeyField(identifier('__index'), superClass),
                ]),
              ]),
              typeAny()
            )
          : tableConstructor(),
        typeIntersection([
          typeReference(
            classIdentifier,
            genericTypeParametersDeclaration &&
              isNonEmptyArray(genericTypeParametersDeclaration)
              ? genericTypeParametersDeclaration
              : undefined
          ),
          typeReference(classIdentifierStatics),
        ])
      );

      const classHasNonPublicMembers = hasNonPublicMembers(node);
      const classPrivateIdentifier =
        createClassIdentifierPrivate(classIdentifier);

      const privateDeclaratorValue = classHasNonPublicMembers
        ? typeCastExpression(
            classIdentifier,
            typeIntersection([
              typeReference(
                classPrivateIdentifier,
                genericTypeParametersDeclaration &&
                  isNonEmptyArray(genericTypeParametersDeclaration)
                  ? genericTypeParametersDeclaration
                  : undefined
              ),
              typeReference(classIdentifierStatics),
            ])
          )
        : undefined;

      return nodeGroup([
        variableDeclaration(
          [variableDeclaratorIdentifier(classIdentifier)],
          [variableDeclaratorValue(publicDeclaratorValue)]
        ),
        ...(privateDeclaratorValue
          ? [
              variableDeclaration(
                [variableDeclaratorIdentifier(classPrivateIdentifier)],
                [variableDeclaratorValue(privateDeclaratorValue)]
              ),
            ]
          : []),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              typeCastExpression(classIdentifier, typeAny()),
              '.',
              identifier('__index')
            ),
          ],
          [classIdentifier]
        ),
      ]);
    },
    { skipComments: true }
  );
};
