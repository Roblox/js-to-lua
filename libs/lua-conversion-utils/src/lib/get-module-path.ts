import { isTruthy } from '@js-to-lua/shared-utils';
import { curry } from 'ramda';

interface GetModulePathConfig {
  isInitFile: boolean;
}

export const getModulePath = curry(
  ({ isInitFile }: GetModulePathConfig, str: string) => {
    const isRelative = str.startsWith('.');
    const path = [
      ...(isRelative
        ? isInitFile
          ? ['script']
          : ['script', 'Parent']
        : ['Packages']),
      ...str
        .replace(/^\.\//, '')
        .split('/')
        .map((pathPart) => {
          switch (pathPart) {
            case '.':
              return null;
            case '..':
              return 'Parent';
            default:
              return pathPart;
          }
        })
        .filter(isTruthy),
    ];
    return {
      path,
      isRelative,
    };
  }
);
