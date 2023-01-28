import { Conflict } from './conflict';

export const overlappingLines = (left: string, right: string): number => {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  return leftLines.reduce(
    (sum, line, index) => (rightLines[index] === line ? sum + 1 : sum),
    0
  );
};

export const partiallyPatch = (
  toParse: string,
  old: Conflict,
  fix: string[],
  replacements: [Conflict?, Conflict?]
): string => {
  return toParse.replace(
    String(old),
    [String(replacements[0]), ...fix, String(replacements[1])]
      .filter((block) => !!block && block !== 'undefined')
      .join('\n')
  );
};

export const extractFromConflict = (
  conflict: Conflict,
  query: RegExp,
  part: 0 | 1
): Conflict | undefined => {
  const currentMatch = conflict.current?.match(query);
  const current = !currentMatch
    ? null
    : conflict.current?.split(currentMatch[0])[part];
  const incomingMatch = conflict.incoming?.match(query);
  const incoming = !incomingMatch
    ? null
    : conflict.incoming?.split(incomingMatch[0])[part];

  if (!current && !incoming) {
    return;
  }

  return new Conflict(
    current,
    incoming,
    conflict.currentName,
    conflict.incomingName
  );
};
