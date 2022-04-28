import {
  QualifiedTypeIdentifier,
  isIdentifier as isBabelIdentifier,
} from '@babel/types';
import { createHandlerFunction } from '@js-to-lua/handler-utils';
import { reassignComments } from '@js-to-lua/lua-conversion-utils';
import { LuaIdentifier, identifier } from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';

export const createFlowQualifiedTypeIdentifierHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction
) => {
  const handleFlowQualifiedTypeIdentifier = createHandlerFunction<
    LuaIdentifier,
    QualifiedTypeIdentifier
  >((source, config, nodeId): LuaIdentifier => {
    const left = isBabelIdentifier(nodeId.qualification)
      ? handleIdentifierStrict(source, config, nodeId.qualification)
      : handleFlowQualifiedTypeIdentifier(source, config, nodeId.qualification);
    const right = handleIdentifierStrict(source, config, nodeId.id);

    return reassignComments(
      identifier(`${left.name}_${right.name}`),
      left,
      right
    );
  });
  return handleFlowQualifiedTypeIdentifier;
};
