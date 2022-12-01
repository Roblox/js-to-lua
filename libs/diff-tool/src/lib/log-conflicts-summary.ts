import { ConflictsSummary } from './diff-tool.types';
import { add, reduce } from 'ramda';

export const sumConflicts = (
  key: keyof ConflictsSummary[string],
  summary: ConflictsSummary
): number =>
  reduce(
    (sum, value: ConflictsSummary[string]) => add(sum, value[key]),
    0
  )(Object.values(summary));

export function logConflictsSummary(summary: ConflictsSummary) {
  console.log('Total files with conflicts:', Object.keys(summary).length);
  console.log('Total conflicts:', sumConflicts('conflicts', summary));
  console.log('Total conflicted lines:', sumConflicts('lines', summary));
  console.log('===Conflicts Summary===');
  Object.keys(summary).forEach((filename) => {
    console.log(filename + ':', summary[filename]);
  });
  console.log('======\n');
}
