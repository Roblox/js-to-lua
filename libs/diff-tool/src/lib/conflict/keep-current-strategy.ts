import { Conflict } from './conflict';
import { ConflictStrategy } from './conflict.types';

export const keepCurrent: ConflictStrategy = (
  toParse: string,
  conflicts: Conflict[]
) => {
  return [
    conflicts.reduce(
      (resolved, conflict) =>
        resolved.replace(String(conflict), conflict.current || ''),
      toParse
    ),
    [],
  ];
};
