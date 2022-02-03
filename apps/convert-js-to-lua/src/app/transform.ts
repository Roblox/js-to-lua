import { transformAsync, TransformOptions } from '@babel/core';

const DEFAULT_BABEL_OPTIONS: TransformOptions = {
  sourceType: 'unambiguous',
  plugins: [['@babel/plugin-syntax-typescript', { isTSX: true }]],
  presets: ['@babel/preset-react'],
};

export function transform(
  options: TransformOptions,
  filename: string,
  code: string
): Promise<string> {
  return transformAsync(code, {
    ...(options || DEFAULT_BABEL_OPTIONS),
    filename,
  })
    .then((result) => result?.code || code)
    .catch((err) => {
      console.warn(err);
      return code;
    });
}
