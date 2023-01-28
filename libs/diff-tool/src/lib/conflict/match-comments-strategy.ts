import { ConflictStrategy } from './conflict.types';
import { overlappingLines } from './utilities';

export const matchComments: ConflictStrategy = (input, conflicts) => {
  let newConflicts = [...conflicts];
  let newInput = input;

  conflicts.forEach((conflict) => {
    if (conflict.current == null || conflict.incoming == null) {
      return;
    }

    const rawOverlap = overlappingLines(conflict.incoming, conflict.current);
    const left = removeComments(conflict.current);
    const right = removeComments(conflict.incoming);
    const actualOverlap = overlappingLines(left, right);

    if (actualOverlap !== rawOverlap) {
      const leftLines = conflict.current.split('\n');
      const leftUncommentedLines = left.split('\n');
      const rightLines = conflict.incoming.split('\n');
      const rightUncommentedLines = right.split('\n');

      let start = -1;
      let length = 0;

      for (let i = 0; i < Math.min(leftLines.length, rightLines.length); ++i) {
        if (
          leftLines[i] !== rightLines[i] &&
          leftUncommentedLines[i] === rightUncommentedLines[i]
        ) {
          if (start === -1) {
            start = i;
          }
          length++;
        }
      }

      const splitConflicts = [
        ...(start > 0 ? [conflict.slice(0, start)] : []),
        ...(start + length < Math.min(leftLines.length, rightLines.length)
          ? [conflict.slice(start + length)]
          : []),
      ];
      newConflicts = [...newConflicts, ...splitConflicts].filter(
        (other) => other !== conflict
      );
      newInput = newInput.replace(
        String(conflict),
        [
          String(splitConflicts[0]),
          ...rightLines.slice(start, start + length),
          String(splitConflicts[1]),
        ]
          .filter((block) => !!block && block !== 'undefined')
          .join('\n')
      );
    }
  });

  return [newInput, newConflicts];
};

const removeComments = (input: string) =>
  input
    .replaceAll(/-- +/g, '')
    .replaceAll('-- /**', '')
    .replaceAll('--  */', '')
    .replaceAll(/-- {2}\* ?/g, '')
    .replaceAll('--[[*', '')
    .replaceAll(/ \* ?/g, '')
    .replaceAll(/\n \]\] ?/g, '\n');
