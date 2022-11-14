export const normalizePathSeparators = (filePath: string) =>
  filePath.split(/[\\/]/g).join('/');
