export function logConflictsSummary(summary: { [filename: string]: number }) {
  console.log('Total files with conflicts:', Object.keys(summary).length);
  console.log(
    'Total conflicts:',
    Object.values(summary).reduce((sum, count) => {
      return sum + count;
    }, 0)
  );
  console.log('===Conflicts Summary===');
  Object.keys(summary).forEach((filename) => {
    console.log(filename + ':', summary[filename]);
  });
  console.log('======\n');
}
