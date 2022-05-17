import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { isIdentifier, TSQualifiedName } from '@babel/types';

export const createTsQualifiedNameHandler = () => {
  const handleTsQualifiedName: BaseNodeHandler<LuaIdentifier, TSQualifiedName> =
    createHandler(
      'TSQualifiedName',
      (_source, _config, node: TSQualifiedName) => {
        const handler = (node: TSQualifiedName): LuaIdentifier =>
          identifier(
            `${
              isIdentifier(node.left) ? node.left.name : handler(node.left).name
            }_${node.right.name}`
          );
        return handler(node);
      }
    );

  return handleTsQualifiedName;
};
