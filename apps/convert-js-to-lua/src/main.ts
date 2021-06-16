import { convertFiles } from './app/convert-files';
import { getFiles } from './app/get-files';
import { getArgs } from './app/get-args';

const { input, output } = getArgs();

const isString = (v: any): v is string => typeof v === 'string';

getFiles(input.filter(isString)).then(convertFiles(output));
