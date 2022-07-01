import { TSFunctionType, TSType } from '@babel/types';
import { HandlerFunction } from '@js-to-lua/handler-utils';
import { LuaType } from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createTsFunctionMethodTypeHandler } from './ts-function-method-type.handler';

export const createTsFunctionTypeHandler = (
  handleIdentifier: IdentifierStrictHandlerFunction,
  typesHandlerFunction: HandlerFunction<LuaType, TSType>
) => {
  const handleTsTypeFunction =
    createTsFunctionMethodTypeHandler<TSFunctionType>(
      handleIdentifier,
      typesHandlerFunction
    );

  return handleTsTypeFunction;
};
