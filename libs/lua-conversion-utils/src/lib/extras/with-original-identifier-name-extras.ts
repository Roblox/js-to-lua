import { withExtras } from './extras';

export const createWithOriginalIdentifierNameExtras = (name: string) =>
  withExtras({
    originalIdentifierName: name,
  });
