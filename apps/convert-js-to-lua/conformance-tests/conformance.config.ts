export default {
  outputPath: './dist/output-tests/',
  inputPath: './conformance-tests',
  excludeFiles: [
    // ---- Milestone 1 ----
    'conformance-tests/base-types/strings/octal-escape-sequence-follow-by-8.js',
    'conformance-tests/base-types/strings/octal-escape-sequences.js',
    'conformance-tests/structural-types/object/single-false-key-to-boolean.js',

    // ---- Milestone 4 ----
    'conformance-tests/complex/query-data-ref_spec_m4.js',
    'conformance-tests/complex/graph-ql-lexer-test.ts',

    'conformance-tests/operators/relational/in/string-key_m4.js',
    'conformance-tests/operators/relational/in/string_m4.js',

    // --- destructuring begin
    'conformance-tests/statements/declarations/destructure-multiple-obj_m4.js',

    'conformance-tests/operators/assignment/destructure-multiple-obj_m4.js',
    // --- destructuring end

    'conformance-tests/expressions/sequence/0_m4.js',
    'conformance-tests/expressions/sequence/1_m4.js',
    'conformance-tests/expressions/sequence/2_m4.js',
    'conformance-tests/expressions/sequence/3_m4.js',
    'conformance-tests/expressions/sequence/4_m4.js',
  ],
};
