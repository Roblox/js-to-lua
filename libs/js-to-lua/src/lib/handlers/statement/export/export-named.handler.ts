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

export const createExportNamedHandler = (
  handleDeclaration: HandlerFunction<LuaDeclaration, Declaration>
) =>
  createHandler(
    'ExportNamedDeclaration',
    (source, node: ExportNamedDeclaration) => {
      if (node.declaration) {
        const declaration = handleDeclaration(source, node.declaration);
        const declarationIds = declaration ? getDeclarationId(declaration) : [];

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

const getDeclarationId = (declaration: LuaDeclaration): LuaLVal[] => {
  switch (declaration.type) {
    case 'FunctionDeclaration':
      return [declaration.id];
    case 'VariableDeclaration':
      return declaration.identifiers.map(({ value }) => value);
    default:
      return [];
  }
};
export const foo = 'bar';
