import {
  ClassBody,
  ClassDeclaration,
  ClassMethod,
  ClassPrivateMethod,
  ClassPrivateProperty,
  ClassProperty,
  Declaration,
  Expression,
  FlowType,
  isAssignmentPattern,
  isClassMethod,
  isClassPrivateMethod,
  isClassPrivateProperty,
  isClassProperty,
  isIdentifier as isBabelIdentifier,
  isMemberExpression as isBabelMemberExpression,
  isNoop,
  isPrivateName,
  isTSDeclareMethod,
  isTSParameterProperty,
  LVal,
  Noop,
  Statement,
  TSDeclareMethod,
  TSParameterProperty,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultUnhandledIdentifierHandlerWithComment,
  getNodeSource,
  removeTypeAnnotation,
  typeReferenceWithoutDefaultType,
  selfIdentifier,
  withClassDeclarationExtra,
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
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaPropertySignature,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  memberExpression,
  nilLiteral,
  nodeGroup,
  returnStatement,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeCastExpression,
  typeIntersection,
  typeLiteral,
  typePropertySignature,
  typeReference,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isNonEmptyArray, Unpacked } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createFunctionBodyHandler } from '../expression/function-body.handler';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment/assignment-pattern.handler';
import { inferType } from '../type/infer-type';
import { createTypeParameterDeclarationHandler } from '../type/type-parameter-declaration.handler';
import { createHandlePublicMethodsAndProperties } from './class-public-methods-properties.handler';

export const createClassDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  handleType: HandlerFunction<LuaType, FlowType | TSType>
): BaseNodeHandler<LuaNodeGroup, ClassDeclaration> =>
  createHandler('ClassDeclaration', (source, config, node) => {
    let unhandledAssignments = 0;
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

    const superClass = node.superClass
      ? handleExpression(source, config, node.superClass)
      : undefined;

    const declaratorValue = superClass
      ? callExpression(identifier('setmetatable'), [
          tableConstructor(),
          tableConstructor([
            tableNameKeyField(identifier('__index'), superClass),
          ]),
        ])
      : tableConstructor();

    const constructorMethod = node.body.body.find(isClassConstructor);

    const nonStaticInitializedClassProperties = node.body.body
      .filter(isAnyClassProperty)
      .filter((n) => n.value && !n.static);

    const staticInitializedClassProperties = node.body.body
      .filter(isAnyClassProperty)
      .filter((n) => n.value && n.static);

    const bodyWithoutConstructor = node.body.body.filter(
      (n) => !isClassConstructor(n)
    );

    const constructorPublicTsParameters: TSParameterProperty[] =
      (constructorMethod &&
        constructorMethod.params.filter(
          (n): n is TSParameterProperty =>
            isTSParameterProperty(n) && n.accessibility === 'public'
        )) ||
      [];

    const publicMethodsAndProperties = [
      ...bodyWithoutConstructor.filter(
        (n): n is ClassMethod | TSDeclareMethod | ClassProperty =>
          (isPublicClassMethod(n) || isClassProperty(n)) &&
          !n.static &&
          isPublic(n)
      ),
    ];

    const classNodeMaybeIdentifier = handleIdentifier(source, config, node.id);

    if (!isIdentifier(classNodeMaybeIdentifier)) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX comment: unhandled class with identifier of type ${classNodeMaybeIdentifier.type}`,
        getNodeSource(source, node)
      );
    }
    const classNodeIdentifier = classNodeMaybeIdentifier;

    const handlePublicMethodsAndProperties =
      createHandlePublicMethodsAndProperties(
        handleExpression,
        handleIdentifier,
        handleTypeAnnotation,
        handleType
      )(source, { ...config, classIdentifier: classNodeIdentifier });

    const publicTypes: LuaPropertySignature[] = [
      ...constructorPublicTsParameters.map((property) => {
        const id = getParameterPropertyIdentifier(property);
        return typePropertySignature(
          removeTypeAnnotation(id),
          handleClassTsParameterProperty(property)
        );
      }),
      ...publicMethodsAndProperties.map(handlePublicMethodsAndProperties),
    ];

    const handleTypeParameterDeclaration =
      createTypeParameterDeclarationHandler(handleType).handler(source, config);

    const genericTypeParametersDeclaration =
      node.typeParameters &&
      !isNoop(node.typeParameters) &&
      node.typeParameters.params.length
        ? handleTypeParameterDeclaration(node.typeParameters)
        : undefined;

    const classConversion = [
      variableDeclaration(
        [variableDeclaratorIdentifier(classNodeIdentifier)],
        [variableDeclaratorValue(declaratorValue)]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(classNodeIdentifier, '.', identifier('__index'))],
        [classNodeIdentifier]
      ),
      ...staticInitializedClassProperties.map(handleStaticProps),
      ...handleConstructor(constructorMethod),
      ...bodyWithoutConstructor
        .filter((n) => !isAnyClassProperty(n))
        .map((n) => {
          if (isAnyClassMethod(n)) {
            return handleClassMethod(n);
          } else {
            return withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX comment: unhandled class body node type ${n.type}`,
              getNodeSource(source, n)
            );
          }
        }),
    ];

    const classOwnType = typeLiteral(publicTypes);
    const superTypeParameters = node.superTypeParameters
      ? applyTo(
          node.superTypeParameters.params.map((p) =>
            handleType(source, config, p)
          ),
          (arr) => (isNonEmptyArray(arr) ? arr : undefined)
        )
      : undefined;
    const classType = !superClass
      ? classOwnType
      : isIdentifier(superClass)
      ? typeIntersection([
          typeReference(superClass, superTypeParameters),
          classOwnType,
        ])
      : withTrailingConversionComment(
          classOwnType,
          `ROBLOX comment: Unhandled superclass type: ${superClass.type}`
        );

    return withClassDeclarationExtra(
      nodeGroup([
        typeAliasDeclaration(
          classNodeIdentifier,
          classType,
          genericTypeParametersDeclaration
        ),
        ...classConversion,
      ])
    );

    function handleStaticProps(property: ClassProperty | ClassPrivateProperty) {
      const propertyKey = !isPrivateName(property.key)
        ? handleExpression(source, config, property.key)
        : defaultUnhandledIdentifierHandlerWithComment(
            `ROBLOX comment: unhandled class body node type ${property.key.type}`
          )(source, config, property.key);
      return assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          isIdentifier(propertyKey)
            ? memberExpression(classNodeIdentifier, '.', propertyKey)
            : indexExpression(classNodeIdentifier, propertyKey),
        ],
        [
          property.value
            ? handleExpression(source, config, property.value)
            : nilLiteral(),
        ]
      );
    }

    function handleConstructorTsParameterProp(node: TSParameterProperty) {
      if (isBabelIdentifier(node.parameter)) {
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

      if (isBabelIdentifier(node.parameter.left)) {
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

    function handleConstructor(constructorMethod?: ClassMethod) {
      const defaultSelfDeclaration = applyTo(
        variableDeclaration(
          [variableDeclaratorIdentifier(selfIdentifier())],
          [
            variableDeclaratorValue(
              callExpression(identifier('setmetatable'), [
                tableConstructor(),
                classNodeIdentifier,
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
          const propertyKey = !isPrivateName(n.key)
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
      const genericTypeParameters = genericTypeParametersDeclaration
        ? applyTo(
            genericTypeParametersDeclaration.params.map(
              typeReferenceWithoutDefaultType
            ),
            (params) => (isNonEmptyArray(params) ? params : undefined)
          )
        : undefined;
      return constructorMethod
        ? [
            functionDeclaration(
              identifier(`${classNodeIdentifier.name}.new`),
              [...functionParamsHandler(source, config, constructorMethod)],
              nodeGroup([
                defaultSelfDeclaration,
                ...handleParamsBody(source, config, constructorMethod),
                ...constructorMethod.params
                  .filter((n): n is TSParameterProperty =>
                    isTSParameterProperty(n)
                  )
                  .map(handleConstructorTsParameterProp),
                ...nonStaticPropertiesConstructorInitializers,
                ...functionBodyHandler(source, config, constructorMethod),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(classNodeIdentifier, genericTypeParameters)
                  )
                ),
              ]),
              typeAnnotation(
                typeReference(classNodeIdentifier, genericTypeParameters)
              ),
              false,
              genericTypeParametersDeclaration
            ),
          ]
        : [
            functionDeclaration(
              identifier(`${classNodeIdentifier.name}.new`),
              [],
              nodeGroup([
                defaultSelfDeclaration,
                ...nonStaticPropertiesConstructorInitializers,
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(classNodeIdentifier, genericTypeParameters)
                  )
                ),
              ]),
              typeAnnotation(
                typeReference(classNodeIdentifier, genericTypeParameters)
              ),
              false,
              genericTypeParametersDeclaration
            ),
          ];
    }

    function handleClassMethod(
      node: ClassMethod | ClassPrivateMethod | TSDeclareMethod
    ) {
      if (isPrivateName(node.key)) {
        return withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX comment: unhandled class body node type ${node.key.type}`,
          getNodeSource(source, node)
        );
      }
      const id = handleExpression(source, config, node.key);

      return isBabelIdentifier(node.key) && isIdentifier(id)
        ? functionDeclaration(
            identifier(
              `${classNodeIdentifier.name}${node.static ? '.' : ':'}${id.name}`
            ),
            [...functionParamsHandler(source, config, node)],
            nodeGroup([
              ...handleParamsBody(source, config, node),
              ...functionBodyHandler(source, config, node),
            ]),
            node.returnType
              ? handleTypeAnnotation(source, config, node.returnType)
              : undefined,
            false
          )
        : withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX comment: unhandled key type ${node.key.type}`,
            getNodeSource(source, node.key)
          );
    }

    function handleClassTsParameterProperty(
      property: TSParameterProperty
    ): LuaTypeAnnotation {
      return property.parameter.typeAnnotation
        ? handleTypeAnnotation(
            source,
            config,
            property.parameter.typeAnnotation
          )
        : isAssignmentPattern(property.parameter)
        ? !isBabelMemberExpression(property.parameter.left) &&
          property.parameter.left.typeAnnotation
          ? handleTypeAnnotation(
              source,
              config,
              property.parameter.left.typeAnnotation
            )
          : typeAnnotation(inferType(property.parameter.right))
        : typeAnnotation(typeAny());
    }

    function getParameterPropertyIdentifier({
      parameter,
    }: TSParameterProperty): LuaIdentifier {
      if (isBabelIdentifier(parameter)) {
        return handleIdentifier(source, config, parameter);
      } else if (isBabelIdentifier(parameter.left)) {
        return handleIdentifier(source, config, parameter.left);
      } else {
        return withTrailingConversionComment(
          identifier(`__unhandled__${'_'.repeat(unhandledAssignments++)}`),
          getNodeSource(source, parameter.left)
        );
      }
    }
  });

type ClassBodyNode = Unpacked<ClassBody['body']>;

const isClassConstructor = (node: ClassBodyNode): node is ClassMethod =>
  isClassMethod(node) &&
  isBabelIdentifier(node.key) &&
  node.key.name === 'constructor';
const isAnyClassProperty = (
  node: ClassBodyNode
): node is ClassProperty | ClassPrivateProperty =>
  isClassProperty(node) || isClassPrivateProperty(node);

const isAnyClassMethod = (
  node: ClassBodyNode
): node is ClassMethod | ClassPrivateMethod | TSDeclareMethod =>
  isClassMethod(node) || isClassPrivateMethod(node) || isTSDeclareMethod(node);
const isPublic = (node: {
  accessibility?: 'public' | 'private' | 'protected' | null;
}): boolean => !node.accessibility || node.accessibility === 'public';

const isPublicClassMethod = (
  node: ClassBodyNode
): node is ClassMethod | TSDeclareMethod =>
  (isClassMethod(node) || isTSDeclareMethod(node)) && isPublic(node);
