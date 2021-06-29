import { AssignmentPattern, Identifier, LVal } from '@babel/types';
import {
  identifier,
  LuaBinaryExpression,
  LuaFunctionParam,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';

export const createFunctionParamsHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >
): BaseNodeHandler<LuaFunctionParam, LVal> => {
  const defaultFunctionParamHandler: HandlerFunction<
    LuaFunctionParam,
    LVal
  > = createHandlerFunction((source, node) => {
    return withConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      source.slice(node.start, node.end)
    );
  });

  return combineHandlers<
    LuaFunctionParam,
    BaseNodeHandler<LuaFunctionParam, LVal>
  >(
    [
      createHandler(
        'Identifier',
        (source, node: Identifier) =>
          handleIdentifier(source, node) as LuaFunctionParam
      ),
      createHandler(
        'AssignmentPattern',
        (source, node: AssignmentPattern) =>
          handleIdentifier(source, node.left as Identifier) as LuaFunctionParam
      ),
    ],
    defaultFunctionParamHandler
  );
};
