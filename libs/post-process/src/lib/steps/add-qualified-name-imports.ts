import {
  getAllQualifiedNameAdditionalImportExtra,
  isWithQualifiedNameAdditionalImportExtra,
  visit,
} from '@js-to-lua/lua-conversion-utils';
import {
  identifier,
  isMemberExpression,
  isTypeAliasDeclaration,
  memberExpression,
  nodeGroup,
  typeAliasDeclaration,
} from '@js-to-lua/lua-types';
import { ProcessProgramFunction } from '@js-to-lua/plugin-utils';

export const addQualifiedNameImports: ProcessProgramFunction = (program) => {
  if (isWithQualifiedNameAdditionalImportExtra(program)) {
    const allQualifiedNameAdditionalImportExtra =
      getAllQualifiedNameAdditionalImportExtra(program);

    const map = Object.keys(allQualifiedNameAdditionalImportExtra).reduce(
      (result, qualifiedNameIdentifier) => {
        const { baseIdentifier } =
          allQualifiedNameAdditionalImportExtra[qualifiedNameIdentifier];
        const entry = result.get(baseIdentifier);
        if (entry) {
          entry.push(qualifiedNameIdentifier);
          entry.sort();
        } else {
          result.set(baseIdentifier, [qualifiedNameIdentifier]);
        }
        return result;
      },
      new Map<string, string[]>()
    );

    visit(program, (node) => {
      if (
        isTypeAliasDeclaration(node) &&
        isMemberExpression(node.typeAnnotation)
      ) {
        const typeAnnotation = node.typeAnnotation;
        const typeId = node.id.name;
        const additionalIds = map.get(typeId);
        if (additionalIds) {
          map.delete(typeId);
          const additionalTypeDeclarations = additionalIds.map((id) =>
            typeAliasDeclaration(
              identifier(id),
              memberExpression(typeAnnotation.base, '.', identifier(id))
            )
          );
          return nodeGroup([node, ...additionalTypeDeclarations]);
        }
      }
    });
  }

  return program;
};
