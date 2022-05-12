import {
  ArrayPattern,
  ArrowFunctionExpression,
  Declaration,
  Expression,
  FunctionExpression,
  isArrayPattern,
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isObjectPattern,
  isObjectProperty,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
  Statement,
  VariableDeclaration,
  VariableDeclarator,
} from '@babel/types';
import {
  AsStatementHandlerFunction,
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  EmptyConfig,
  handleComments,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  asStatementReturnTypeToReturn,
  defaultStatementHandler,
  getNodeSource,
  reassignComments,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaVariableDeclaration,
  LuaVariableDeclarator,
  nodeGroup,
  UnhandledStatement,
  unhandledStatement,
  variableDeclaration,
  variableDeclarator,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { isTruthy, splitBy } from '@js-to-lua/shared-utils';
import {
  IdentifierHandlerFunction,
  IdentifierStrictHandlerFunction,
} from '../expression/identifier-handler-types';
import { createLValHandler } from '../l-val.handler';
import {
  createArrayPatternDestructuringHandler,
  hasUnhandledArrayDestructuringParam,
} from '../pattern/array-pattern-destructuring.handler';
import {
  createObjectPatternDestructuringHandler,
  hasUnhandledObjectDestructuringParam,
} from '../pattern/object-pattern-destructuring.handler';
import { createConvertToFunctionDeclarationHandler } from './convert-to-function-declaration.handler';

export const createVariableDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Expression
  >,
  handleIdentifier: IdentifierHandlerFunction,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleDeclaration: HandlerFunction<LuaNodeGroup | LuaDeclaration, Declaration>
): BaseNodeHandler<
  LuaNodeGroup | LuaVariableDeclaration,
  VariableDeclaration
> =>
  createHandler('VariableDeclaration', (source, config, declaration) => {
    const lValHandler = createLValHandler(
      handleIdentifier,
      handleExpression
    ).handler;

    const objectPatternDestructuringHandler =
      createObjectPatternDestructuringHandler(
        handleExpression,
        lValHandler,
        handleIdentifierStrict,
        handleObjectField
      );

    const arrayPatternDestructuringHandler =
      createArrayPatternDestructuringHandler(handleExpression);

    type StatementsWithDeclarator = {
      preStatements: LuaStatement[];
      postStatements: LuaStatement[];
      declarators: LuaVariableDeclarator[];
    };
    const handleVariableDeclarator = (
      source: string,
      config: EmptyConfig,
      node: VariableDeclarator
    ): StatementsWithDeclarator => {
      const initAsStatementReturn = node.init
        ? asStatementReturnTypeToReturn(
            handleExpressionAsStatement(source, config, node.init)
          )
        : null;
      const lVal = lValHandler(source, config, node.id);

      return initAsStatementReturn
        ? {
            preStatements: initAsStatementReturn.preStatements,
            postStatements: initAsStatementReturn.postStatements,
            declarators: initAsStatementReturn.toReturn.map((value) =>
              handleComments(source, node, variableDeclarator(lVal, value))
            ),
          }
        : {
            preStatements: [],
            postStatements: [],
            declarators: [
              handleComments(source, node, variableDeclarator(lVal, null)),
            ],
          };
    };

    const convertToFunctionDeclaration =
      createConvertToFunctionDeclarationHandler(
        handleStatement,
        handleExpression,
        handleExpressionAsStatement,
        handleIdentifier,
        handleDeclaration,
        lValHandler
      );

    const convertVariableFunctionToFunctionDeclaration: HandlerFunction<
      LuaFunctionDeclaration | UnhandledStatement,
      VariableDeclarator
    > = createHandlerFunction((source, config, node: VariableDeclarator) => {
      switch (node.init?.type) {
        case 'ArrowFunctionExpression':
        case 'FunctionExpression':
          return convertToFunctionDeclaration(
            source,
            config,
            node.init,
            lValHandler(source, config, node.id) as LuaIdentifier
          );
        default:
          return withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ${node.init?.type}, when within 'init' expression for ${node.type} node`,
            getNodeSource(source, node)
          );
      }
    });

    const toFunctionDeclaration = convertVariableFunctionToFunctionDeclaration(
      source,
      config
    );

    type SeparateDeclarator = VariableDeclarator &
      (
        | {
            init: FunctionExpression | ArrowFunctionExpression;
          }
        | {
            id: ObjectPattern | ArrayPattern;
          }
      );
    const splitGroups = declaration.declarations.reduce(
      splitBy((declarator): declarator is SeparateDeclarator => {
        return (
          (declarator.init && isFunctionExpression(declarator.init)) ||
          isArrowFunctionExpression(declarator.init) ||
          isObjectPattern(declarator.id) ||
          isArrayPattern(declarator.id)
        );
      }),
      []
    );

    const declarations = splitGroups
      .map((group) => {
        if (Array.isArray(group)) {
          return handleVariableDeclarationGroup(
            group.map((declarator) =>
              handleVariableDeclarator(source, config, declarator)
            )
          );
        } else if (isObjectPattern(group.id)) {
          return objectPatternDestructuringDeclarationHandler(
            group as VariableDeclarator & { id: ObjectPattern }
          );
        } else if (isArrayPattern(group.id)) {
          return handleArrayPatternDeclaration(
            group as VariableDeclarator & { id: ArrayPattern; init: Expression }
          );
        } else if (
          isFunctionExpression(group.init) ||
          isArrowFunctionExpression(group.init)
        ) {
          return toFunctionDeclaration(group);
        }

        return defaultStatementHandler(source, config, group);
      })
      .flat();

    return declarations.length > 1 ? nodeGroup(declarations) : declarations[0];

    function objectPatternDestructuringDeclarationHandler(
      declarator: VariableDeclarator & { id: ObjectPattern }
    ) {
      const idProperties = declarator.id.properties;

      if (
        hasUnhandledObjectDestructuringParam(
          idProperties.filter((property) =>
            isObjectProperty(property)
          ) as ObjectProperty[]
        )
      ) {
        return [
          withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled Variable declaration when one of the object properties is not supported`,
            // This is a workaround for synthetically created variable declarations when handling function params
            getNodeSource(source, declarator) ||
              getNodeSource(source, declarator.id)
          ),
        ];
      }

      if (
        declarator.init &&
        (isIdentifier(declarator.init) || idProperties.length < 2)
      ) {
        const destructured = objectPatternDestructuringHandler(
          source,
          config,
          handleExpression(source, config, declarator.init),
          idProperties
        );
        return variableDeclaration(
          destructured.ids.map((id) => variableDeclaratorIdentifier(id)),
          destructured.values.map((value) => variableDeclaratorValue(value))
        );
      } else if (declarator.init) {
        const refIdentifier = identifier('ref');
        const destructured = objectPatternDestructuringHandler(
          source,
          config,
          refIdentifier,
          idProperties
        );
        return nodeGroup([
          variableDeclaration(
            destructured.ids.map((id) => variableDeclaratorIdentifier(id)),
            []
          ),
          blockStatement([
            variableDeclaration(
              [variableDeclaratorIdentifier(refIdentifier)],
              [
                variableDeclaratorValue(
                  handleExpression(source, config, declarator.init)
                ),
              ]
            ),
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              destructured.ids,
              destructured.values
            ),
          ]),
        ]);
      } else {
        return withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled object destructuring init type: "${declarator.init}"`,
          getNodeSource(source, declarator)
        );
      }
    }

    function handleArrayPatternDeclaration(
      declarator: Omit<VariableDeclarator, 'id' | 'init'> & {
        id: ArrayPattern;
        init: Expression;
      }
    ): (LuaVariableDeclaration | UnhandledStatement)[] {
      const init = handleExpression(source, config, declarator.init);
      const elements = declarator.id.elements.filter(isTruthy);
      if (hasUnhandledArrayDestructuringParam(elements)) {
        return [
          withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled Variable declaration when one of the elements is not supported`,
            // This is a workaround for synthetically created variable declarations when handling function params
            getNodeSource(source, declarator) ||
              getNodeSource(source, declarator.id)
          ),
        ];
      }

      return arrayPatternDestructuringHandler(
        source,
        config,
        elements,
        init
      ).map((node) =>
        variableDeclaration(
          node.ids.map((id) =>
            variableDeclaratorIdentifier(lValHandler(source, config, id))
          ),
          node.values.map((value) => variableDeclaratorValue(value))
        )
      );
    }

    function handleVariableDeclarationGroup(
      declarationGroup: StatementsWithDeclarator[]
    ): LuaStatement {
      const declarators = declarationGroup
        .map(({ declarators }) => declarators)
        .flat();
      const varIdsAndValues = declarators.reduceRight<
        Pick<LuaVariableDeclaration, 'identifiers' | 'values'>
      >(
        (obj, declarator) => {
          obj.identifiers.unshift(variableDeclaratorIdentifier(declarator.id));
          if (declarator.init !== null || obj.values.length > 0) {
            obj.values.unshift(variableDeclaratorValue(declarator.init));
          }
          return obj;
        },
        { identifiers: [], values: [] }
      );

      const declaration = reassignComments(
        variableDeclaration(
          varIdsAndValues.identifiers,
          varIdsAndValues.values
        ),
        ...declarators
      );
      const preStatements = declarationGroup
        .map(({ preStatements }) => preStatements)
        .flat();
      const postStatements = declarationGroup
        .map(({ postStatements }) => postStatements)
        .flat();

      return preStatements.length || postStatements.length
        ? nodeGroup([...preStatements, declaration, ...postStatements])
        : declaration;
    }
  });
