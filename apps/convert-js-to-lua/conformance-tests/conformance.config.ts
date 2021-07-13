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

    'conformance-tests/operators/assignment-bitwise-and/0_m4.js',
    'conformance-tests/operators/assignment-bitwise-and/1_m4.js',

    'conformance-tests/operators/assignment-bitwise-or/0_m4.js',
    'conformance-tests/operators/assignment-bitwise-or/1_m4.js',

    'conformance-tests/operators/assignment-bitwise-xor/0_m4.js',
    'conformance-tests/operators/assignment-bitwise-xor/1_m4.js',

    'conformance-tests/operators/assignment-shift-left/0_m4.js',
    'conformance-tests/operators/assignment-shift-left/1_m4.js',

    'conformance-tests/operators/assignment-shift-right/0_m4.js',
    'conformance-tests/operators/assignment-shift-right/1_m4.js',

    'conformance-tests/operators/assignment-shift-right-unsigned/0_m4.js',
    'conformance-tests/operators/assignment-shift-right-unsigned/1_m4.js',
    'conformance-tests/operators/assignment-shift-right-unsigned/2_m4.js',

    // --- destructuring begin
    'conformance-tests/statements/declarations/destructure-multiple-obj_m4.js',

    'conformance-tests/structural-types/functions/arrow/with-destructured-arr-param-shorthand_m4.js',
    'conformance-tests/structural-types/functions/arrow/with-destructured-arr-param_m4.js',
    'conformance-tests/structural-types/functions/arrow/with-destructured-obj-param-shorthand_m4.js',
    'conformance-tests/structural-types/functions/arrow/with-destructured-obj-param_m4.js',
    'conformance-tests/structural-types/functions/arrow/with-multiple-destructured-arr-param_m4.js',
    'conformance-tests/structural-types/functions/arrow/with-multiple-destructured-obj-param_m4.js',

    'conformance-tests/structural-types/functions/expressions/with-destructured-arr-param_m4.js',
    'conformance-tests/structural-types/functions/expressions/with-destructured-obj-param_m4.js',
    'conformance-tests/structural-types/functions/expressions/with-multiple-destructured-arr-param_m4.js',
    'conformance-tests/structural-types/functions/expressions/with-multiple-destructured-obj-param_m4.js',

    'conformance-tests/structural-types/functions/named/with-destructured-arr-param_m4.js',
    'conformance-tests/structural-types/functions/named/with-destructured-obj-param_m4.js',
    'conformance-tests/structural-types/functions/named/with-multiple-destructured-arr-param_m4.js',
    'conformance-tests/structural-types/functions/named/with-multiple-destructured-obj-param_m4.js',

    'conformance-tests/operators/assignment/destructure-multiple-obj_m4.js',
    // --- destructuring end

    'conformance-tests/expressions/sequence/0_m4.js',
    'conformance-tests/expressions/sequence/1_m4.js',
    'conformance-tests/expressions/sequence/2_m4.js',
    'conformance-tests/expressions/sequence/3_m4.js',
    'conformance-tests/expressions/sequence/4_m4.js',

    'conformance-tests/statements/conditional/switch/0_m4.js',
    'conformance-tests/statements/conditional/switch/1_m4.js',
    'conformance-tests/statements/conditional/switch/2_m4.js',
    'conformance-tests/statements/conditional/switch/3_m4.js',
    'conformance-tests/statements/conditional/switch/4_m4.js',
    'conformance-tests/statements/conditional/switch/5_m4.js',
    'conformance-tests/statements/conditional/switch/6_m4.js',
  ],
};
