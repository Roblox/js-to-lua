import { promisify } from 'util';
import * as glob from 'glob';

export const getFiles = (inputs: string[]): Promise<string[]> => {
  const promiseGlob = promisify(glob);
  return Promise.all(inputs.map((input) => promiseGlob(input))).then(
    (files: string[][]) => Array<string>().concat(...files)
  );
};
