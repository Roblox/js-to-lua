import * as Babel from '@babel/types';
import {
  AsStatementHandlerFunction,
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
  unhandledIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  blockStatement,
  identifier,
  isIdentifier,
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
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleExpressionAsStatement: AsStatementHandlerFunction<
    LuaStatement,
    Babel.Expression
  >,
  handleIdentifier: IdentifierHandlerFunction,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    Babel.ObjectMethod | Babel.ObjectProperty
  >,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Babel.Declaration
  >
) =>
  createHandler<LuaStatement, Babel.VariableDeclaration>(
    'VariableDeclaration',
    (source, config, declaration) => {
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
        node: Babel.VariableDeclarator
      ): StatementsWithDeclarator => {
        const initAsStatementReturn = node.init
          ? asStatementReturnTypeToReturn(
              handleExpressionAsStatement(source, config, node.init)
            )
          : null;
        const lVal = lValHandler(source, config, node.id);

        const variableIdentifier = isIdentifier(lVal)
          ? lVal
          : unhandledIdentifier();

        return initAsStatementReturn
          ? {
              preStatements: initAsStatementReturn.preStatements,
              postStatements: initAsStatementReturn.postStatements,
              declarators: [
                handleComments(
                  source,
                  node,
                  variableDeclarator(
                    variableIdentifier,
                    initAsStatementReturn.toReturn
                  )
                ),
              ],
            }
          : {
              preStatements: [],
              postStatements: [],
              declarators: [
                handleComments(
                  source,
                  node,
                  variableDeclarator(variableIdentifier, null)
                ),
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
        Babel.VariableDeclarator
      > = createHandlerFunction(
        (source, config, node: Babel.VariableDeclarator) => {
          switch (node.init?.type) {
            case 'ArrowFunctionExpression':
              return convertToFunctionDeclaration(
                source,
                config,
                node.init,
                lValHandler(source, config, node.id) as LuaIdentifier
              );
            case 'FunctionExpression':
              return node.init.id &&
                Babel.isIdentifier(node.id) &&
                node.id.name !== node.init.id.name
                ? nodeGroup([
                    convertToFunctionDeclaration(
                      source,
                      config,
                      node.init,
                      lValHandler(source, config, node.init.id) as LuaIdentifier
                    ),
                    variableDeclaration(
                      [
                        variableDeclaratorIdentifier(
                          lValHandler(source, config, node.id)
                        ),
                      ],
                      [
                        variableDeclaratorValue(
                          lValHandler(source, config, node.init.id)
                        ),
                      ]
                    ),
                  ])
                : convertToFunctionDeclaration(
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
        }
      );

      const toFunctionDeclaration =
        convertVariableFunctionToFunctionDeclaration(source, config);

      type SeparateDeclarator = Babel.VariableDeclarator &
        (
          | {
              init: Babel.FunctionExpression | Babel.ArrowFunctionExpression;
            }
          | {
              id: Babel.ObjectPattern | Babel.ArrayPattern;
            }
        );
      const splitGroups = declaration.declarations.reduce(
        splitBy(
          (
            declarator: Babel.VariableDeclarator
          ): declarator is SeparateDeclarator => {
            return (
              Babel.isFunctionExpression(declarator.init) ||
              Babel.isArrowFunctionExpression(declarator.init) ||
              Babel.isObjectPattern(declarator.id) ||
              Babel.isArrayPattern(declarator.id)
            );
          }
        ),
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
          } else if (Babel.isObjectPattern(group.id)) {
            return objectPatternDestructuringDeclarationHandler(
              group as Babel.VariableDeclarator & { id: Babel.ObjectPattern }
            );
          } else if (Babel.isArrayPattern(group.id)) {
            return handleArrayPatternDeclaration(
              group as Babel.VariableDeclarator & {
                id: Babel.ArrayPattern;
                init: Babel.Expression;
              }
            );
          } else if (
            Babel.isFunctionExpression(group.init) ||
            Babel.isArrowFunctionExpression(group.init)
          ) {
            return toFunctionDeclaration(group);
          }

          return defaultStatementHandler(source, config, group);
        })
        .flat() as LuaStatement[];

      return declarations.length > 1
        ? nodeGroup(declarations)
        : declarations[0];

      function objectPatternDestructuringDeclarationHandler(
        declarator: Babel.VariableDeclarator & { id: Babel.ObjectPattern }
      ) {
        const idProperties = declarator.id.properties;

        if (
          hasUnhandledObjectDestructuringParam(
            idProperties.filter((property) =>
              Babel.isObjectProperty(property)
            ) as Babel.ObjectProperty[]
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
          (Babel.isIdentifier(declarator.init) || idProperties.length < 2)
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
        declarator: Omit<Babel.VariableDeclarator, 'id' | 'init'> & {
          id: Babel.ArrayPattern;
          init: Babel.Expression;
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
            obj.identifiers.unshift(
              variableDeclaratorIdentifier(declarator.id)
            );
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
    }
  );
