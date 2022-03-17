import {
  isTSExternalModuleReference,
  LVal,
  TSImportEqualsDeclaration,
} from '@babel/types';
import {
  createHandler,
  handleComments,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import { defaultStatementHandler } from '@js-to-lua/lua-conversion-utils';
import {
  LuaDeclaration,
  LuaLVal,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { createImportExpressionHandler } from './import/import-expression.handler';

export const createTsImportEqualsDeclarationHandler = (
  handleIdentifier: HandlerFunction<LuaLVal, LVal>
) =>
  createHandler<LuaDeclaration, TSImportEqualsDeclaration>(
    'TSImportEqualsDeclaration',
    (source, config, node) => {
      const importExpressionHandler = createImportExpressionHandler();

      if (
        !node.isExport &&
        node.importKind === 'value' &&
        isTSExternalModuleReference(node.moduleReference)
      ) {
        const declaratorValue = variableDeclaratorValue(
          importExpressionHandler(
            source,
            config,
            node.moduleReference.expression
          )
        );
        return variableDeclaration(
          [
            variableDeclaratorIdentifier(
              handleIdentifier(source, config, node.id)
            ),
          ],
          [handleComments(source, node.moduleReference, declaratorValue)]
        );
      }
      return defaultStatementHandler(source, config, node);
    }
  );
