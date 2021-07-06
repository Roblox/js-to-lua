import { createHandler, HandlerFunction } from '../../../types';
import { Declaration, ExportNamedDeclaration } from '@babel/types';
import {
  assignmentStatement,
  identifier,
  indexExpression,
  isIdentifier,
  LuaDeclaration,
  LuaLVal,
  memberExpression,
  nodeGroup,
} from '@js-to-lua/lua-types';
import { defaultStatementHandler } from '../../../utils/default-handlers';
import { NonEmptyArray } from '@js-to-lua/shared-utils';

export const createExportNamedHandler = (
  handleDeclaration: HandlerFunction<LuaDeclaration, Declaration>
) =>
  createHandler(
    'ExportNamedDeclaration',
    (source, node: ExportNamedDeclaration) => {
      if (node.declaration) {
        const declaration = handleDeclaration(source, node.declaration);
        const declarationIds = getDeclarationId(declaration);

        return nodeGroup([
          declaration,
          assignmentStatement(
            declarationIds.map((id) =>
              isIdentifier(id)
                ? memberExpression(identifier('exports'), '.', id)
                : indexExpression(identifier('exports'), id)
            ),
            declarationIds
          ),
        ]);
      }

      return defaultStatementHandler(source, node);
    }
  );

const getDeclarationId = (
  declaration: LuaDeclaration
): NonEmptyArray<LuaLVal> => {
  switch (declaration.type) {
    case 'FunctionDeclaration':
    case 'LuaTypeAliasDeclaration':
      return [declaration.id];
    case 'VariableDeclaration':
      return declaration.identifiers.map(
        ({ value }) => value
      ) as NonEmptyArray<LuaLVal>;
    default:
      return [declaration];
  }
};
export const foo = 'bar';
