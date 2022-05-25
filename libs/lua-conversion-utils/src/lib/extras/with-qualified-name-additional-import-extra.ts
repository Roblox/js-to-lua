import { LuaNode } from '@js-to-lua/lua-types';
import { WithExtras, withExtras } from './extras';

type QualifiedNameAdditionalImportExtraBody = {
  [qualifiedNameIdentifier: string]: {
    baseIdentifier: string;
  };
};
type QualifiedNameAdditionalImportExtra = {
  qualifiedNameAdditionalImport: QualifiedNameAdditionalImportExtraBody;
};

export const createWithQualifiedNameAdditionalImportExtra =
  (qualifiedNameIdentifier: string, baseIdentifier: string) =>
  <N extends LuaNode>(node: N) => {
    const prevQualifierNameAdditionalImportExtra =
      isWithQualifiedNameAdditionalImportExtra(node)
        ? getAllQualifiedNameAdditionalImportExtra(node)
        : {};

    return withExtras<QualifiedNameAdditionalImportExtra, N>({
      qualifiedNameAdditionalImport: {
        ...prevQualifierNameAdditionalImportExtra,
        [qualifiedNameIdentifier]: {
          baseIdentifier,
        },
      },
    })(node);
  };

export const isWithQualifiedNameAdditionalImportExtra = <N extends LuaNode>(
  node: N
): node is N & WithExtras<N, QualifiedNameAdditionalImportExtra> =>
  typeof node.extras?.['qualifiedNameAdditionalImport'] === 'object';

export const getAllQualifiedNameAdditionalImportExtra = <N extends LuaNode>(
  node: WithExtras<N, QualifiedNameAdditionalImportExtra>
): QualifiedNameAdditionalImportExtraBody =>
  node.extras.qualifiedNameAdditionalImport;

export const getQualifiedNameAdditionalImportExtra = <N extends LuaNode>(
  qualifiedNameIdentifier: string,
  node: WithExtras<N, QualifiedNameAdditionalImportExtra>
): QualifiedNameAdditionalImportExtraBody[string] =>
  getAllQualifiedNameAdditionalImportExtra(node)[qualifiedNameIdentifier];
