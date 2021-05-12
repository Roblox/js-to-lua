import { promisify } from 'util';
import * as glob from 'glob';

export const getFiles = (input) => {
  const promiseGlob = promisify(glob);
  return promiseGlob(input);
};
