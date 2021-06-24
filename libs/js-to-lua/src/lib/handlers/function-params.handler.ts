import { AssignmentPattern, Identifier, LVal } from '@babel/types';
import { handleIdentifier } from './expression-statement.handler';
import {
  identifier,
  LuaFunctionParam,
  withConversionComment,
} from '@js-to-lua/lua-types';
import { combineHandlers } from '../utils/combine-handlers';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';

export const defaultFunctionParamHandler: HandlerFunction<
  LuaFunctionParam,
  LVal
> = createHandlerFunction((source, node) => {
  return withConversionComment(
    identifier('__unhandledIdentifier__'),
    `ROBLOX TODO: Unhandled node for type: ${node.type}`,
    source.slice(node.start, node.end)
  );
});

export const functionParamsHandler = combineHandlers<
  LuaFunctionParam,
  BaseNodeHandler<LuaFunctionParam, LVal>
>(
  [
    createHandler(
      'Identifier',
      (source, node: Identifier) =>
        handleIdentifier.handler(source, node) as LuaFunctionParam
    ),
    createHandler(
      'AssignmentPattern',
      (source, node: AssignmentPattern) =>
        handleIdentifier.handler(
          source,
          node.left as Identifier
        ) as LuaFunctionParam
    ),
  ],
  defaultFunctionParamHandler
).handler;
