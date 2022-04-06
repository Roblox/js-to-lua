import { UnhandledStatement } from '@js-to-lua/lua-types';
import { PrinterFunction } from '../printer-function';

export const createPrintUnhandledStatement =
  (): PrinterFunction<UnhandledStatement> => () =>
    'error("not implemented");';
