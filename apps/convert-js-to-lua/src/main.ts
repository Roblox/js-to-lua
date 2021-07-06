import { convertFiles } from './app/convert-files';
import { getFiles } from './app/get-files';
import { getArgs } from './app/get-args';

const { input, output, babelConfig } = getArgs();

const isString = (v: unknown): v is string => typeof v === 'string';

getFiles(input.filter(isString)).then(convertFiles(output, babelConfig));
