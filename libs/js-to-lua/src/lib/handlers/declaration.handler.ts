import {
  ArrowFunctionExpression,
  AssignmentPattern,
  Declaration,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  identifier as babelIdentifier,
  isArrayPattern,
  isAssignmentPattern,
  isObjectPattern,
  LVal,
  ObjectMethod,
  ObjectProperty,
  Statement,
  TSType,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  functionDeclaration,
  identifier,
  LuaDeclaration,
  LuaExpression,
  LuaFunctionDeclaration,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaStatement,
  LuaTableKeyField,
  LuaType,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { BaseNodeHandler, EmptyConfig, HandlerFunction } from '../types';
import { combineStatementHandlers } from '../utils/combine-handlers';
import { forwardHandlerRef } from '../utils/forward-handler-ref';
import { createFunctionDeclarationHandler } from './function-declaration.handler';
import { createFunctionParamsHandler } from './function-params.handler';
import { createAssignmentPatternHandlerFunction } from './statement/assignment-pattern.handler';
import { createExportHandler } from './statement/export';
import { createImportHandler } from './statement/import';
import { createTypeAliasDeclarationHandler } from './type-alias-declaration.handler';
import { createTypeAnnotationHandler } from './type-annotation.handler';
import { createVariableDeclarationHandler } from './variable-declaration.handler';
import { anyPass } from 'ramda';
import { defaultStatementHandler } from '../utils/default-handlers';
import { createFunctionBodyHandler } from './expression/function-body.handler';

export const createDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleTsTypes: BaseNodeHandler<LuaType, TSType>
): BaseNodeHandler<LuaNodeGroup | LuaDeclaration, Declaration> => {
  const declarationHandler: BaseNodeHandler<
    LuaNodeGroup | LuaDeclaration,
    Declaration,
    EmptyConfig
  > = combineStatementHandlers<LuaDeclaration | LuaNodeGroup, Declaration>([
    createVariableDeclarationHandler(
      handleExpression,
      handleExpressionAsStatement,
      handleIdentifier,
      handleStatement,
      handleObjectField,
      forwardHandlerRef(() => declarationHandler)
    ),
    createFunctionDeclarationHandler(
      handleIdentifier,
      handleStatement,
      handleExpression,
      handleExpressionAsStatement,
      forwardHandlerRef(() => declarationHandler)
    ),
    createTypeAliasDeclarationHandler(
      handleIdentifier,
      forwardHandlerRef(() => handleTsTypes)
    ),
    createExportHandler(
      forwardHandlerRef(() => declarationHandler),
      handleExpression,
      handleIdentifier
    ),
    createImportHandler(handleExpression, handleIdentifier),
  ]);

  return declarationHandler;
};

export function createConvertToFunctionDeclarationHandler(
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleDeclaration: HandlerFunction<LuaNodeGroup | LuaDeclaration, Declaration>
) {
  const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
    handleExpression,
    handleIdentifier
  );
  const { typesHandler } = createTypeAnnotationHandler(handleExpression);
  const functionParamsHandler = createFunctionParamsHandler(handleIdentifier)
    .handler;

  return function (
    source: string,
    config: EmptyConfig,
    node: FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
    id: LuaIdentifier
  ): LuaFunctionDeclaration {
    const handleFunctionBody = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    )(source, config);

    let paramRefIdCount = 0;
    let destructuringRefIdCount = 0;
    return functionDeclaration(
      id,
      node.params.map((param) => {
        if (
          isArrayPattern(param) ||
          isObjectPattern(param) ||
          (isAssignmentPattern(param) &&
            (isObjectPattern(param.left) || isArrayPattern(param.left)))
        ) {
          return identifier(`ref${'_'.repeat(paramRefIdCount++)}`);
        }
        return functionParamsHandler(source, config, param);
      }),
      [
        ...node.params
          .filter((param) =>
            anyPass([isAssignmentPattern, isObjectPattern, isArrayPattern])(
              param,
              undefined
            )
          )
          .map((param) => {
            if (isAssignmentPattern(param)) {
              if (isArrayPattern(param.left) || isObjectPattern(param.left)) {
                return nodeGroup([
                  handleAssignmentPattern(source, config, {
                    ...param,
                    left: babelIdentifier(
                      `ref${'_'.repeat(destructuringRefIdCount)}`
                    ),
                    right: { ...param.right },
                  } as AssignmentPattern),
                  handleDeclaration(
                    source,
                    node,
                    babelVariableDeclaration('let', [
                      babelVariableDeclarator(
                        param.left,
                        babelIdentifier(
                          `ref${'_'.repeat(destructuringRefIdCount++)}`
                        )
                      ),
                    ])
                  ),
                ]);
              }
              return handleAssignmentPattern(
                source,
                config,
                param as AssignmentPattern
              );
            } else if (isArrayPattern(param)) {
              return handleDeclaration(
                source,
                node,
                babelVariableDeclaration('let', [
                  babelVariableDeclarator(
                    param,
                    babelIdentifier(
                      `ref${'_'.repeat(destructuringRefIdCount++)}`
                    )
                  ),
                ])
              );
            } else if (isObjectPattern(param)) {
              return handleDeclaration(
                source,
                node,
                babelVariableDeclaration('let', [
                  babelVariableDeclarator(
                    param,
                    babelIdentifier(
                      `ref${'_'.repeat(destructuringRefIdCount++)}`
                    )
                  ),
                ])
              );
            } else {
              return defaultStatementHandler(source, config, param);
            }
          }),
        ...handleFunctionBody(node),
      ],
      node.returnType
        ? typesHandler(source, config, node.returnType)
        : undefined
    );
  };
}
