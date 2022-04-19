import { ContinueStatement } from '@js-to-lua/lua-types';
import { PrinterFunction } from '../printer-function';

export const createPrintContinueStatement =
  (): PrinterFunction<ContinueStatement> => () =>
    'continue';
