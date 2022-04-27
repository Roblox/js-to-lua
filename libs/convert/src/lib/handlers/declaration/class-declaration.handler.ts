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
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  defaultUnhandledIdentifierHandlerWithComment,
  getNodeSource,
  reassignComments,
  removeIdTypeAnnotation,
  selfIdentifier,
  withClassDeclarationExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionDeclaration,
  functionTypeParam,
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
  typeFunction,
  typeLiteral,
  typePropertySignature,
  typeReference,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { Unpacked } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { createFunctionBodyHandler } from '../expression/function-body.handler';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment/assignment-pattern.handler';
import { inferType } from '../type/infer-type';

export const createClassDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
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

    const declaratorValue = node.superClass
      ? callExpression(identifier('setmetatable'), [
          tableConstructor(),
          tableConstructor([
            tableNameKeyField(
              identifier('__index'),
              handleExpression(source, config, node.superClass)
            ),
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

    function removeTypeAnnotations<T>(node: T) {
      const newNode: T = { ...node };
      delete (newNode as any).typeAnnotation;
      return newNode;
    }

    const classNodeMaybeIdentifier = handleIdentifier(source, config, node.id);

    if (!isIdentifier(classNodeMaybeIdentifier)) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX comment: unhandled class with identifier of type ${classNodeMaybeIdentifier.type}`,
        getNodeSource(source, node)
      );
    }
    const classNodeIdentifier = classNodeMaybeIdentifier;

    const publicTypes: LuaPropertySignature[] = [
      ...constructorPublicTsParameters.map((property) => {
        const id = getParameterPropertyIdentifier(property);
        return typePropertySignature(
          removeTypeAnnotations(id),
          handleClassTsParameterProperty(property)
        );
      }),
      ...publicMethodsAndProperties.map((n) =>
        typePropertySignature(
          removeTypeAnnotations(handleExpression(source, config, n.key)),
          handleClassMethodOrPropertyTypeAnnotation(n)
        )
      ),
    ];

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

    return withClassDeclarationExtra(
      nodeGroup([
        typeAliasDeclaration(classNodeIdentifier, typeLiteral(publicTypes)),
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
                removeTypeAnnotations(node.parameter)
              )
            ),
          ],
          [
            handleIdentifier(
              source,
              config,
              removeTypeAnnotations(node.parameter)
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
                removeTypeAnnotations(node.parameter.left)
              )
            ),
          ],
          [
            handleIdentifier(
              source,
              config,
              removeTypeAnnotations(node.parameter.left)
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
      const defaultSelfDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(selfIdentifier())],
        [
          variableDeclaratorValue(
            callExpression(identifier('setmetatable'), [
              tableConstructor(),
              classNodeIdentifier,
            ])
          ),
        ]
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
      return constructorMethod
        ? [
            functionDeclaration(
              identifier(`${classNodeIdentifier.name}.new`),
              [...functionParamsHandler(source, config, constructorMethod)],
              nodeGroup([
                node.superClass
                  ? withTrailingConversionComment(
                      defaultSelfDeclaration,
                      `ROBLOX TODO: super constructor may be used`
                    )
                  : defaultSelfDeclaration,
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
                    typeReference(classNodeIdentifier)
                  )
                ),
              ]),
              typeAnnotation(typeReference(classNodeIdentifier)),
              false
            ),
          ]
        : [
            functionDeclaration(
              identifier(`${classNodeIdentifier.name}.new`),
              [],
              nodeGroup([
                node.superClass
                  ? withTrailingConversionComment(
                      defaultSelfDeclaration,
                      `ROBLOX TODO: super constructor may be used`
                    )
                  : defaultSelfDeclaration,
                ...nonStaticPropertiesConstructorInitializers,
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(classNodeIdentifier)
                  )
                ),
              ]),
              typeAnnotation(typeReference(classNodeIdentifier)),
              false
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

    function handleClassMethodOrPropertyTypeAnnotation(
      node: ClassMethod | TSDeclareMethod | ClassProperty
    ): LuaTypeAnnotation {
      if (isClassMethod(node) || isTSDeclareMethod(node)) {
        const fnParams = functionParamsHandler(source, config, node).map(
          (param) =>
            functionTypeParam(
              removeIdTypeAnnotation(param),
              param.typeAnnotation
                ? param.typeAnnotation.typeAnnotation
                : typeAny()
            )
        );

        return typeAnnotation(
          typeFunction(
            [
              functionTypeParam(
                identifier('self'),
                typeReference(classNodeIdentifier)
              ),
              ...fnParams,
            ],
            node.returnType
              ? applyTo(
                  handleTypeAnnotation(source, config, node.returnType),
                  (typeAnnotationNode) =>
                    reassignComments(
                      typeAnnotationNode.typeAnnotation,
                      typeAnnotationNode
                    )
                )
              : typeAny()
          )
        );
      }

      return node.typeAnnotation
        ? handleTypeAnnotation(source, config, node.typeAnnotation)
        : node.value
        ? typeAnnotation(inferType(node.value))
        : typeAnnotation(typeAny());
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
