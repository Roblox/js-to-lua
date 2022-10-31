import * as Babel from '@babel/types';
import { createHandlerFunction, EmptyConfig } from '@js-to-lua/handler-utils';
import {
  LuaIdentifier,
  LuaTypeAliasDeclaration,
  typeAliasDeclaration,
  typeLiteral,
} from '@js-to-lua/lua-types';
import { createClassIdentifierStatics } from '../../class-declaration.utils';

export const createReactHandleClassTypeStaticsAlias = () => {
  return createHandlerFunction<
    LuaTypeAliasDeclaration,
    Babel.ClassDeclaration,
    EmptyConfig & { classIdentifier: LuaIdentifier }
  >(
    (source, config, _node) => {
      const { classIdentifier } = config;

      const classIdentifierStatics =
        createClassIdentifierStatics(classIdentifier);

      const classType = typeLiteral([]);

      return typeAliasDeclaration(classIdentifierStatics, classType);
    },
    { skipComments: true }
  );
};
