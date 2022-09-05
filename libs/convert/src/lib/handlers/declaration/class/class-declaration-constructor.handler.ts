import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
  createHandlerFunction,
  EmptyConfig,
  handleComments,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultUnhandledIdentifierHandlerWithComment,
  getNodeSource,
  removeTypeAnnotation,
  selfIdentifier,
  typeReferenceWithoutDefaultType,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionDeclaration,
  identifier,
  indexExpression,
  isIdentifier,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  memberExpression,
  nilLiteral,
  nodeGroup,
  returnStatement,
  tableConstructor,
  typeAny,
  typeCastExpression,
  typeReference,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createFunctionBodyHandler } from '../../expression/function-body.handler';
import { createFunctionParamsBodyHandler } from '../../function-params-body.handler';
import { createFunctionParamsHandler } from '../../function-params.handler';
import { createAssignmentPatternHandlerFunction } from '../../statement/assignment/assignment-pattern.handler';
import { createTypeParameterDeclarationHandler } from '../../type/type-parameter-declaration.handler';
import {
  createClassIdentifierPrivate,
  hasNonPublicMembers,
  isAnyClassProperty,
  isClassConstructor,
} from './class-declaration.utils';

export const createConstructorHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, Babel.LVal>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    Babel.TypeAnnotation | Babel.TSTypeAnnotation | Babel.Noop
  >,
  handleType: HandlerFunction<LuaType, Babel.FlowType | Babel.TSType>
) => {
  return createHandlerFunction<
    LuaFunctionDeclaration,
    Babel.ClassDeclaration,
    EmptyConfig & {
      classIdentifier: LuaIdentifier;
    }
  >(
    (source, config, node): LuaFunctionDeclaration => {
      const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
        handleExpression,
        handleIdentifier
      );

      const functionParamsHandler = createFunctionParamsHandler(
        handleIdentifier,
        handleTypeAnnotation,
        handleType
      );

      const handleParamsBody = createFunctionParamsBodyHandler(
        handleDeclaration,
        handleAssignmentPattern,
        handleLVal
      );

      const functionBodyHandler = createFunctionBodyHandler(
        handleStatement,
        handleExpressionAsStatement
      );

      const { classIdentifier } = config;
      const classBaseIdentifier = hasNonPublicMembers(node)
        ? createClassIdentifierPrivate(classIdentifier)
        : classIdentifier;

      const constructorMethod = node.body.body.find(isClassConstructor);

      const nonStaticInitializedClassProperties = node.body.body
        .filter(isAnyClassProperty)
        .filter((n) => n.value && !n.static);

      const superClass = node.superClass
        ? handleExpression(source, config, node.superClass)
        : undefined;

      const defaultSelfDeclaration = applyTo(
        variableDeclaration(
          [variableDeclaratorIdentifier(selfIdentifier())],
          [
            variableDeclaratorValue(
              callExpression(identifier('setmetatable'), [
                tableConstructor(),
                classIdentifier,
              ])
            ),
          ]
        ),
        (declaration) =>
          superClass
            ? withTrailingConversionComment(
                declaration,
                `ROBLOX TODO: super constructor may be used`
              )
            : declaration
      );

      const nonStaticPropertiesConstructorInitializers =
        nonStaticInitializedClassProperties.map((n) => {
          const propertyKey = !Babel.isPrivateName(n.key)
            ? handleExpression(source, config, n.key)
            : defaultUnhandledIdentifierHandlerWithComment(
                `ROBLOX comment: unhandled class body node type ${n.key.type}`
              )(source, config, n.key);
          return assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              isIdentifier(propertyKey)
                ? memberExpression(selfIdentifier(), '.', propertyKey)
                : indexExpression(selfIdentifier(), propertyKey),
            ],
            [n.value ? handleExpression(source, config, n.value) : nilLiteral()]
          );
        });

      const handleTypeParameterDeclaration =
        createTypeParameterDeclarationHandler(handleType).handler(
          source,
          config
        );

      const genericTypeParametersDeclaration =
        node.typeParameters &&
        !Babel.isNoop(node.typeParameters) &&
        node.typeParameters.params.length
          ? handleTypeParameterDeclaration(node.typeParameters)
          : undefined;

      const genericTypeParameters = genericTypeParametersDeclaration
        ? applyTo(
            genericTypeParametersDeclaration.params.map(
              typeReferenceWithoutDefaultType
            ),
            (params) => (isNonEmptyArray(params) ? params : undefined)
          )
        : undefined;
      return constructorMethod
        ? handleComments(
            source,
            constructorMethod,
            functionDeclaration(
              identifier(`${classBaseIdentifier.name}.new`),
              [
                ...functionParamsHandler(
                  source,
                  {
                    assignedTo: undefined,
                    noShadowIdentifiers: undefined,
                    ...config,
                  },
                  constructorMethod
                ),
              ],
              nodeGroup([
                defaultSelfDeclaration,
                ...handleParamsBody(source, config, constructorMethod),
                ...constructorMethod.params
                  .filter((n): n is Babel.TSParameterProperty =>
                    Babel.isTSParameterProperty(n)
                  )
                  .map(handleConstructorTsParameterProp),
                ...nonStaticPropertiesConstructorInitializers,
                ...functionBodyHandler(source, config, constructorMethod),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(classIdentifier, genericTypeParameters)
                  )
                ),
              ]),

              typeReference(classIdentifier, genericTypeParameters),
              false,
              genericTypeParametersDeclaration
            )
          )
        : functionDeclaration(
            identifier(`${classBaseIdentifier.name}.new`),
            [],
            nodeGroup([
              defaultSelfDeclaration,
              ...nonStaticPropertiesConstructorInitializers,
              returnStatement(
                typeCastExpression(
                  typeCastExpression(selfIdentifier(), typeAny()),
                  typeReference(classIdentifier, genericTypeParameters)
                )
              ),
            ]),

            typeReference(classIdentifier, genericTypeParameters),
            false,
            genericTypeParametersDeclaration
          );

      function handleConstructorTsParameterProp(
        node: Babel.TSParameterProperty
      ) {
        if (Babel.isIdentifier(node.parameter)) {
          return assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                selfIdentifier(),
                '.',
                handleIdentifier(
                  source,
                  config,
                  removeTypeAnnotation(node.parameter)
                )
              ),
            ],
            [
              handleIdentifier(
                source,
                config,
                removeTypeAnnotation(node.parameter)
              ),
            ]
          );
        }

        if (Babel.isIdentifier(node.parameter.left)) {
          return assignmentStatement(
            AssignmentStatementOperatorEnum.EQ,
            [
              memberExpression(
                selfIdentifier(),
                '.',
                handleIdentifier(
                  source,
                  config,
                  removeTypeAnnotation(node.parameter.left)
                )
              ),
            ],
            [
              handleIdentifier(
                source,
                config,
                removeTypeAnnotation(node.parameter.left)
              ),
            ]
          );
        }
        return withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX comment: unhandled parameter type ${node.parameter.type} and left value of type ${node.parameter.left.type}`,
          getNodeSource(source, node.parameter)
        );
      }
    },
    { skipComments: true }
  );
};
