import { AssignmentPattern, Identifier, LVal } from '@babel/types';
import {
  identifier,
  LuaBinaryExpression,
  LuaFunctionParam,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { getNodeSource } from '../utils/get-node-source';

export const createFunctionParamsHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >
): BaseNodeHandler<LuaFunctionParam, LVal> => {
  const defaultFunctionParamHandler: HandlerFunction<
    LuaFunctionParam,
    LVal
  > = createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

  return combineHandlers<LuaFunctionParam, LVal>(
    [
      createHandler(
        'Identifier',
        (source, config, node: Identifier) =>
          handleIdentifier(source, config, node) as LuaFunctionParam
      ),
      createHandler(
        'AssignmentPattern',
        (source, config, node: AssignmentPattern) =>
          handleIdentifier(
            source,
            config,
            node.left as Identifier
          ) as LuaFunctionParam
      ),
    ],
    defaultFunctionParamHandler
  );
};
