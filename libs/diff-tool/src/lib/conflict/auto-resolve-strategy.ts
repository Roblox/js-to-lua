import { Conflict } from './conflict';
import { ConflictStrategy } from './conflict.types';

/**
 * Automatically resolve all remaining conflicts.
 *
 * This is done by choosing the current section for all conflicts if it contains
 * any code, otherwise use the incoming section instead. The reason why this
 * happens is because other conflict strategies may partially merge or alter
 * conflict blocks in a way that results in sections being empty.
 */
export const autoResolve: ConflictStrategy = (
  toParse: string,
  conflicts: Conflict[]
) => {
  return [
    conflicts.reduce((resolved, conflict) => {
      if (!conflict.current && conflict.incoming) {
        return resolved.replace(String(conflict), conflict.incoming || '');
      } else {
        return resolved.replace(String(conflict), conflict.current || '');
      }
    }, toParse),
    [],
  ];
};
