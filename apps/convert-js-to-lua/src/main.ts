import { convertFiles } from './app/convert-files';
import { getFiles } from './app/get-files';
import { getArgs } from './app/get-args';

const { input, output } = getArgs();

getFiles(input).then(convertFiles(output));
