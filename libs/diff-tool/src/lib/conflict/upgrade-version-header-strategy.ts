import { ConflictStrategy } from './conflict.types';
import { extractFromConflict, partiallyPatch } from './utilities';
import { Conflict } from './conflict';

const versionHeaderRegex = /(^-- ROBLOX upstream:.*)\n?/m;

export const upgradeVersionHeader: ConflictStrategy = (toParse, conflicts) => {
  const firstConflict = conflicts[0];

  if (!firstConflict?.hasContent()) {
    return [toParse, conflicts];
  }

  if (
    versionHeaderRegex.test(firstConflict.incoming) &&
    versionHeaderRegex.test(firstConflict.current)
  ) {
    const newConflicts: [Conflict?, Conflict?] = [
      extractFromConflict(firstConflict, versionHeaderRegex, 0),
      extractFromConflict(firstConflict, versionHeaderRegex, 1),
    ];
    const versionMatch = firstConflict.incoming?.match(versionHeaderRegex);

    return [
      partiallyPatch(
        toParse,
        firstConflict,
        versionMatch ? [versionMatch[1]] : [],
        newConflicts
      ),
      [...conflicts, ...newConflicts].filter(
        (conflict): conflict is Conflict =>
          conflict != null && conflict !== firstConflict
      ),
    ];
  }

  return [toParse, conflicts];
};
