export default {
  outputPath: './dist/output-tests/',
  inputPath: './conformance-tests',
  excludeFiles: [
    // ---- Milestone 1 ----
    'conformance-tests/base-types/strings/octal-escape-sequence-follow-by-8.js',
    'conformance-tests/base-types/strings/octal-escape-sequences.js',

    // ---- Milestone 4 ----
    'conformance-tests/complex/graph-ql-lexer-test.ts',

    'conformance-tests/operators/relational/in/string-key_m4.js',
    'conformance-tests/operators/relational/in/string_m4.js',

    'conformance-tests/complex/react-scheduler-try-catch_m4.js',
    'conformance-tests/complex/react-create-react-noop-try-catch_m4.ts',
    'conformance-tests/complex/graphql-type-info-switch-break.ts',
    'conformance-tests/complex/apollo-client-test-switch-break.ts',
  ],
};
