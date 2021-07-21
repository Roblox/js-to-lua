import {
  ArrowFunctionExpression,
  AssignmentPattern,
  Declaration,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  identifier as babelIdentifier,
  isArrayPattern,
  isAssignmentPattern,
  isIdentifier,
  isObjectPattern,
  LVal,
  ObjectMethod,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
} from '@babel/types';
import {
  AssignmentStatement,
  identifier,
  LuaBinaryExpression,
  LuaDeclaration,
  LuaFunctionParam,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaNodeGroup,
  nodeGroup,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { createHandlerFunction, EmptyConfig, HandlerFunction } from '../types';
import {
  defaultStatementHandler,
  defaultUnhandledIdentifierHandler,
} from '../utils/default-handlers';
import { anyPass } from 'ramda';

type FunctionTypes =
  | ArrowFunctionExpression
  | FunctionExpression
  | FunctionDeclaration
  | ObjectMethod;

export const createFunctionParamsHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >
): ((
  source: string,
  config: EmptyConfig,
  node: FunctionTypes
) => LuaIdentifier[]) => {
  const defaultFunctionParamHandler: HandlerFunction<
    LuaFunctionParam,
    LVal
  > = createHandlerFunction((source, config, node) => {
    return defaultUnhandledIdentifierHandler(source, config, node);
  });

  return (source: string, config: EmptyConfig, node: FunctionTypes) => {
    let paramRefIdCount = 0;
    return node.params.map((param) => {
      if (
        isArrayPattern(param) ||
        isObjectPattern(param) ||
        (isAssignmentPattern(param) &&
          (isObjectPattern(param.left) || isArrayPattern(param.left)))
      ) {
        return identifier(`ref${'_'.repeat(paramRefIdCount++)}`);
      } else if (isIdentifier(param)) {
        return handleIdentifier(source, config, param) as LuaFunctionParam;
      } else if (isAssignmentPattern(param)) {
        return handleIdentifier(
          source,
          config,
          param.left as Identifier
        ) as LuaFunctionParam;
      }
      return defaultFunctionParamHandler(source, config, param);
    });
  };
};

type ParamsBodyResponse = Array<
  LuaNodeGroup | LuaDeclaration | AssignmentStatement | UnhandledStatement
>;

export const createFunctionParamsBodyHandler = (
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    AssignmentPattern
  >
): ((
  source: string,
  config: EmptyConfig,
  node: FunctionTypes
) => ParamsBodyResponse) => {
  return (source: string, config: EmptyConfig, node: FunctionTypes) => {
    let destructuringRefIdCount = 0;
    return node.params
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
              }),
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
          return handleAssignmentPattern(source, config, param);
        } else if (isArrayPattern(param)) {
          return handleDeclaration(
            source,
            node,
            babelVariableDeclaration('let', [
              babelVariableDeclarator(
                param,
                babelIdentifier(`ref${'_'.repeat(destructuringRefIdCount++)}`)
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
                babelIdentifier(`ref${'_'.repeat(destructuringRefIdCount++)}`)
              ),
            ])
          );
        } else {
          return defaultStatementHandler(source, config, param);
        }
      });
  };
};
