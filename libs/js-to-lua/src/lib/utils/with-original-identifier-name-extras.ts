import { withExtras } from '@js-to-lua/lua-types';

export const createWithOriginalIdentifierNameExtras = (name: string) =>
  withExtras({
    originalIdentifierName: name,
  });
