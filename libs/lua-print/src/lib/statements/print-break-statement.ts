import { BreakStatement } from '@js-to-lua/lua-types';
import { PrinterFunction } from '../printer-function';

export const createPrintBreakStatement =
  (): PrinterFunction<BreakStatement> => () =>
    'break;';
