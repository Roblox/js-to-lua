export default {
  outputPath: './dist/output-tests/',
  inputPath: './conformance-tests',
  excludeFiles: [
    'conformance-tests/base-types/booleans/boolean-typed.ts',
    'conformance-tests/base-types/numbers/infinity.js',
    'conformance-tests/base-types/numbers/integer-with-separator.js',
    'conformance-tests/base-types/strings/multiline-template.js',
    'conformance-tests/base-types/strings/simple-typed.ts',
    'conformance-tests/base-types/strings/template-escape-new-line.js',
  ],
};
