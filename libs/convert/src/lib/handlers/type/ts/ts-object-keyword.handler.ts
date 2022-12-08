import { TSObjectKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import {
  arrayTypeIdentifier,
  objectTypeIdentifier,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  LuaType,
  typeReference,
  typeUnion,
} from '@js-to-lua/lua-types';

export const createTsObjectKeywordHandler = () =>
  createHandler<LuaType, TSObjectKeyword>('TSObjectKeyword', () =>
    typeUnion([
      typeReference(objectTypeIdentifier()),
      typeReference(arrayTypeIdentifier(), [
        typeReference(identifier('unknown')),
      ]),
    ])
  );
