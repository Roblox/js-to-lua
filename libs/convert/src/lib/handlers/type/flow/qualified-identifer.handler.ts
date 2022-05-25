import {
  isIdentifier as isBabelIdentifier,
  QualifiedTypeIdentifier,
} from '@babel/types';
import { createHandlerFunction } from '@js-to-lua/handler-utils';
import {
  createWithQualifiedNameAdditionalImportExtra,
  getOptionalOriginalIds,
  reassignComments,
  withOriginalIds,
} from '@js-to-lua/lua-conversion-utils';
import { identifier, LuaIdentifier } from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';

export const createFlowQualifiedTypeIdentifierHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) => {
  const handleFlowQualifiedTypeIdentifierInner = createHandlerFunction<
    LuaIdentifier,
    QualifiedTypeIdentifier
  >((source, config, nodeId): LuaIdentifier => {
    const left = isBabelIdentifier(nodeId.qualification)
      ? withOriginalIds(
          [nodeId.qualification.name],
          handleIdentifierStrict(source, config, nodeId.qualification)
        )
      : handleFlowQualifiedTypeIdentifierInner(
          source,
          config,
          nodeId.qualification
        );
    const right = handleIdentifierStrict(source, config, nodeId.id);

    const resultId = withOriginalIds(
      [...getOptionalOriginalIds(left), right.name],
      identifier(`${left.name}_${right.name}`)
    );
    return reassignComments(resultId, left, right);
  });
  return createHandlerFunction<LuaIdentifier, QualifiedTypeIdentifier>(
    (source, config, node) => {
      const qualifiedId = handleFlowQualifiedTypeIdentifierInner(
        source,
        config,
        node
      );
      const originalIds: string[] = getOptionalOriginalIds(qualifiedId);
      return createWithQualifiedNameAdditionalImportExtra(
        qualifiedId.name,
        originalIds[0]
      )(qualifiedId);
    },
    { skipComments: true }
  );
};
