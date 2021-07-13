import {
  ArrayPattern,
  ArrowFunctionExpression,
  Expression,
  FunctionExpression,
  isArrayPattern,
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isObjectExpression,
  isObjectPattern,
  isRestElement,
  LVal,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
  PatternLike,
  Statement,
  VariableDeclaration,
  VariableDeclarator,
} from '@babel/types';
import {
  identifier,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
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
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { isTruthy, splitBy } from '@js-to-lua/shared-utils';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { defaultStatementHandler } from '../utils/default-handlers';
import { handleArrayPatternDestructuring } from './array-pattern-destructuring.handler';
import { createConvertToFunctionDeclarationHandler } from './declaration.handler';
import { createLValHandler } from './l-val.handler';
import { createObjectPatternDestructuringHandler } from './object-pattern-destructuring.handler';

export const createVariableDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >
): BaseNodeHandler<
  LuaNodeGroup | LuaVariableDeclaration,
  VariableDeclaration
> =>
  createHandler('VariableDeclaration', (source, config, declaration) => {
    const lValHandler = createLValHandler(handleIdentifier, handleExpression)
      .handler;

    const objectPatternDestructuringHandler = createObjectPatternDestructuringHandler(
      handleExpression,
      lValHandler,
      handleObjectField
    );

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
          return withTrailingConversionComment(
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
          return objectPatternDestructuringDeclarationHandler(
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

    function objectPatternDestructuringDeclarationHandler(
      declaration: VariableDeclarator & { id: ObjectPattern }
    ) {
      const idProperties = declaration.id.properties;

      if (declaration.init && isObjectExpression(declaration.init)) {
        const helperIdentifier = identifier(`ref`);
        const destructured = objectPatternDestructuringHandler(
          source,
          config,
          helperIdentifier,
          idProperties
        );
        return nodeGroup([
          variableDeclaration(
            [variableDeclaratorIdentifier(helperIdentifier)],
            [
              variableDeclaratorValue(
                handleExpression(source, config, declaration.init)
              ),
            ]
          ),
          variableDeclaration(
            destructured.ids.map((id) => variableDeclaratorIdentifier(id)),
            destructured.values.map((value) => variableDeclaratorValue(value))
          ),
        ]);
      } else if (declaration.init && isIdentifier(declaration.init)) {
        const destructured = objectPatternDestructuringHandler(
          source,
          config,
          handleExpression(source, config, declaration.init),
          idProperties
        );
        return variableDeclaration(
          destructured.ids.map((id) => variableDeclaratorIdentifier(id)),
          destructured.values.map((value) => variableDeclaratorValue(value))
        );
      } else {
        return withTrailingConversionComment(
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
          withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ArrayPattern variable declaration when one of the elements is not an Identifier or RestElement`,
            source.slice(declaration.start || 0, declaration.end || 0)
          ),
        ];
      }

      return handleArrayPatternDestructuring(elements, init).map((node) =>
        variableDeclaration(
          node.ids.map((id) =>
            variableDeclaratorIdentifier(lValHandler(source, config, id))
          ),
          node.values.map((value) => variableDeclaratorValue(value))
        )
      );
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
    }
  });
