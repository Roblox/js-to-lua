import { ContinueStatement } from '@js-to-lua/lua-types';

export const createPrintContinueStatement = () => (_node: ContinueStatement) =>
  'continue';
