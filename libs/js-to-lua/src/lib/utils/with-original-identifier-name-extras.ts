import { withExtras } from '@js-to-lua/lua-conversion-utils';

export const createWithOriginalIdentifierNameExtras = (name: string) =>
  withExtras({
    originalIdentifierName: name,
  });
