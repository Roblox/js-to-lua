import {
  ArrayPattern,
  ArrowFunctionExpression,
  Expression,
  FunctionExpression,
  Identifier,
  isArrayPattern,
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isObjectExpression,
  isObjectPattern,
  isObjectProperty,
  isRestElement,
  LVal,
  ObjectPattern,
  ObjectProperty,
  PatternLike,
  RestElement,
  Statement,
  VariableDeclaration,
  VariableDeclarator,
} from '@babel/types';
import {
  callExpression,
  identifier,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaMemberExpression,
  LuaNodeGroup,
  LuaStatement,
  LuaVariableDeclaration,
  LuaVariableDeclarator,
  LuaVariableDeclaratorIdentifier,
  LuaVariableDeclaratorValue,
  memberExpression,
  nodeGroup,
  numericLiteral,
  UnhandledStatement,
  unhandledStatement,
  variableDeclaration,
  variableDeclarator,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { isTruthy, splitBy } from '@js-to-lua/shared-utils';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { defaultStatementHandler } from '../utils/default-handlers';
import { createConvertToFunctionDeclarationHandler } from './declaration.handler';
import { createLValHandler } from './l-val.handler';

export const createVariableDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>
): BaseNodeHandler<
  LuaNodeGroup | LuaVariableDeclaration,
  VariableDeclaration
> =>
  createHandler('VariableDeclaration', (source, config, declaration) => {
    const lValHandler = createLValHandler(handleIdentifier).handler;

    const handleVariableDeclarator: BaseNodeHandler<
      LuaVariableDeclarator,
      VariableDeclarator
    > = createHandler(
      'VariableDeclarator',
      (source, config, node: VariableDeclarator) => {
        return variableDeclarator(
          lValHandler(source, config, node.id),
          node.init ? handleExpression(source, config, node.init) : null
        );
      }
    );

    const convertToFunctionDeclaration = createConvertToFunctionDeclarationHandler(
      handleStatement,
      handleExpression,
      handleIdentifier
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
          return withConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ${node.init?.type}, when within 'init' expression for ${node.type} node`,
            source.slice(node.start || 0, node.end || 0)
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
              handleVariableDeclarator.handler(source, config, declarator)
            )
          );
        } else if (isObjectPattern(group.id)) {
          return handleObjectPatternDeclaration(
            group as VariableDeclarator & { id: ObjectPattern }
          );
        } else if (isArrayPattern(group.id)) {
          return handleArrayPatternDeclaration(
            group.id.elements.filter(isTruthy),
            handleExpression(source, config, group.init!)
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

    function getObjectPropertiesIdentifiersAndValues(
      properties: ObjectProperty[],
      base: LuaIdentifier | LuaMemberExpression
    ): {
      ids: LuaVariableDeclaratorIdentifier[];
      values: LuaVariableDeclaratorValue[];
    } {
      return properties.reduce(
        (obj, property) => {
          if (isIdentifier(property.value)) {
            obj.ids.push(
              variableDeclaratorIdentifier(identifier(property.value.name))
            );
            obj.values.push(
              variableDeclaratorValue(
                memberExpression(
                  base,
                  '.',
                  identifier((property.key as Identifier).name)
                )
              )
            );
            return obj;
          } else if (isObjectPattern(property.value)) {
            const { ids, values } = getObjectPropertiesIdentifiersAndValues(
              property.value.properties as ObjectProperty[],
              memberExpression(
                base,
                '.',
                identifier((property.key as Identifier).name)
              )
            );

            obj.ids.push(...ids);
            obj.values.push(...values);
            return obj;
          }
          return obj;
        },
        {
          ids: <LuaVariableDeclaratorIdentifier[]>[],
          values: <LuaVariableDeclaratorValue[]>[],
        }
      );
    }

    function handleIdentifierDestructuring(
      id: LuaIdentifier,
      properties: ObjectProperty[]
    ) {
      const { ids, values } = getObjectPropertiesIdentifiersAndValues(
        properties,
        id
      );

      return variableDeclaration(ids, values);
    }

    function hasRestElement(
      properties: (ObjectProperty | RestElement)[]
    ): boolean {
      if (properties.some((property) => isRestElement(property))) {
        return true;
      }

      const objectPatternValues: ObjectPattern[] = properties
        .filter(
          (property): property is ObjectProperty & { value: ObjectPattern } =>
            isObjectProperty(property) && isObjectPattern(property.value)
        )
        .map((property) => property.value);

      if (objectPatternValues.length) {
        return objectPatternValues.some((value) =>
          hasRestElement(value.properties)
        );
      }

      return false;
    }

    function handleObjectPatternDeclaration(
      declaration: VariableDeclarator & { id: ObjectPattern }
    ) {
      if (
        isObjectPattern(declaration.id) &&
        hasRestElement(declaration.id.properties)
      ) {
        return withConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled object destructuring with RestElement in "id.properties"`,
          source.slice(declaration.start || 0, declaration.end || 0)
        );
      }

      const idProperties = declaration.id.properties as ObjectProperty[];

      if (declaration.init && isObjectExpression(declaration.init)) {
        const helperIdentifier = identifier(`ref`);
        return nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(helperIdentifier)],
            [
              variableDeclaratorValue(
                handleExpression(source, config, declaration.init)
              ),
            ]
          ),
          handleIdentifierDestructuring(helperIdentifier, idProperties),
        ]);
      } else if (declaration.init && isIdentifier(declaration.init)) {
        return handleIdentifierDestructuring(
          handleExpression(source, config, declaration.init),
          idProperties
        );
      } else {
        return withConversionComment(
          unhandledStatement(),
          `ROBLOX TODO: Unhandled object destructuring init type: "${declaration.init?.type}"`,
          source.slice(declaration.start || 0, declaration.end || 0)
        );
      }
    }

    function handleArrayPatternDeclaration(
      elements: PatternLike[],
      init: LuaExpression
    ): (LuaVariableDeclaration | UnhandledStatement)[] {
      if (
        elements.some(
          (el) => !(isIdentifier(el) || isRestElement(el) || isArrayPattern(el))
        )
      ) {
        return [
          withConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ArrayPattern variable declaration when one of the elements is not an Identifier or RestElement`,
            source.slice(declaration.start || 0, declaration.end || 0)
          ),
        ];
      }

      const nodes: (LuaVariableDeclaration | UnhandledStatement)[] = [];

      let tempIdentifierNodes: Identifier[] = [];
      let startIndex: number | null = null;

      function flushIdentifierDeclarations(fromIndex: number, toIndex: number) {
        nodes.push(
          variableDeclaration(
            tempIdentifierNodes.map((element) =>
              variableDeclaratorIdentifier(
                handleExpression(source, config, element as Expression)
              )
            ),
            [
              variableDeclaratorValue(
                callExpression(identifier('table.unpack'), [
                  init,
                  numericLiteral(fromIndex + 1),
                  numericLiteral(toIndex + 1),
                ])
              ),
            ]
          )
        );
        tempIdentifierNodes = [];
        startIndex = null;
      }

      elements.forEach((el, i) => {
        if (isIdentifier(el)) {
          startIndex = startIndex == null ? i : startIndex;
          tempIdentifierNodes.push(el);
          if (i === elements.length - 1) {
            flushIdentifierDeclarations(startIndex, i);
          }
        } else {
          flushIdentifierDeclarations(startIndex!, i - 1);

          if (isRestElement(el)) {
            nodes.push(
              variableDeclaration(
                [
                  variableDeclaratorIdentifier(
                    lValHandler(source, config, el.argument)
                  ),
                ],
                [
                  variableDeclaratorValue(
                    callExpression(identifier('table.pack'), [
                      callExpression(identifier('table.unpack'), [
                        init,
                        numericLiteral(i + 1),
                      ]),
                    ])
                  ),
                ]
              )
            );
          } else if (isArrayPattern(el)) {
            nodes.push(
              ...handleArrayPatternDeclaration(
                el.elements.filter(isTruthy),
                callExpression(identifier('table.unpack'), [
                  init,
                  numericLiteral(i + 1),
                  numericLiteral(i + 1),
                ])
              )
            );
          }
        }
      });

      return nodes;
    }

    function handleVariableDeclarationGroup(
      declarationGroup: LuaVariableDeclarator[]
    ): LuaVariableDeclaration {
      const varIdsAndValues = declarationGroup.reduceRight<
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

      return variableDeclaration(
        varIdsAndValues.identifiers,
        varIdsAndValues.values
      );
      [];
    }
  });