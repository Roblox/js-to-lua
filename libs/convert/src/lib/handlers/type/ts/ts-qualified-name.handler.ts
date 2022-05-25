import * as Babel from '@babel/types';
import { BaseNodeHandler, createHandler } from '@js-to-lua/handler-utils';
import { createWithQualifiedNameAdditionalImportExtra } from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export const createTsQualifiedNameHandler = () => {
  const handleTsQualifiedName: BaseNodeHandler<
    LuaIdentifier,
    Babel.TSQualifiedName
  > = createHandler(
    'TSQualifiedName',
    (_source, _config, node: Babel.TSQualifiedName) => {
      const handler = (
        node: Babel.TSQualifiedName
      ): { id: LuaIdentifier; originalIds: NonEmptyArray<string> } => {
        const left = Babel.isIdentifier(node.left)
          ? { id: node.left, originalIds: [node.left.name] }
          : handler(node.left);
        return {
          id: identifier(`${left.id.name}_${node.right.name}`),
          originalIds: [...left.originalIds, node.right.name],
        };
      };
      const { id, originalIds } = handler(node);
      return createWithQualifiedNameAdditionalImportExtra(
        id.name,
        originalIds[0]
      )(id);
    }
  );

  return handleTsQualifiedName;
};
