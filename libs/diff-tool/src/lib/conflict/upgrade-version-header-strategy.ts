import { ConflictStrategy } from './conflict.types';

const versionHeaderRegex = /^-- ROBLOX upstream:.*/;
export const upgradeVersionHeader: ConflictStrategy = (toParse, conflicts) => {
  const [firstLine, secondLine] = conflicts[0]?.current?.split('\n') || [];

  // When there's just a single change in current, and that line matches the format of a Roblox version comment.
  // We can safely replace it with the incoming change.
  if (firstLine && !secondLine && versionHeaderRegex.test(firstLine)) {
    return [
      toParse.replace(String(conflicts[0]), conflicts[0]?.incoming || ''),
      conflicts.slice(1),
    ];
  }
  return [toParse, conflicts];
};
