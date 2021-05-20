export default {
  outputPath: './dist/output-tests/',
  inputPath: './conformance-tests',
  excludeFiles: [
    'conformance-tests/base-types/numbers/integer-with-separator.js',
    'conformance-tests/base-types/strings/multiline-template.js',
    'conformance-tests/base-types/strings/template-escape-new-line.js',
    'conformance-tests/base-types/strings/escape-sequences.js',
    'conformance-tests/base-types/strings/hex-escape-sequences.js',
    'conformance-tests/base-types/strings/multiline-template-first-line-empty.js',
    'conformance-tests/base-types/strings/multiline-template-with-double-brackets.js',
    'conformance-tests/base-types/strings/multiline-template-with-long-double-brackets.js',
    'conformance-tests/base-types/strings/octal-escape-sequence-follow-by-8.js',
    'conformance-tests/base-types/strings/octal-escape-sequences.js',
    'conformance-tests/structural-types/object/single-number-key-to-boolean.js',
    'conformance-tests/structural-types/object/single-octal-number-key-to-boolean.js',
    'conformance-tests/structural-types/object/single-identifier-to-boolean.js',
    'conformance-tests/structural-types/object/single-identifier-to-boolean.js',
    'conformance-tests/structural-types/object/single-false-key-to-boolean.js',
    'conformance-tests/structural-types/object/single-exponent-number-key-to-boolean.js',
    'conformance-tests/structural-types/functions/named/empty.js',
    'conformance-tests/structural-types/functions/named/empty-single-parameter.js',
    'conformance-tests/structural-types/functions/named/empty-typed-void-return-value.ts',
    'conformance-tests/structural-types/functions/named/empty-typed-string-return-value.ts',
    'conformance-tests/structural-types/functions/named/empty-single-typed-parameter.ts',
    'conformance-tests/structural-types/array/mixed-with-three-elements.js',
  ],
};