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

    // ---- Milestone 5 ----
    'conformance-tests/statements/for-loops/simple/single-for-loop_m5.js',
    'conformance-tests/statements/for-loops/simple/single-for-loop-modifying_m5.js',
    'conformance-tests/statements/for-loops/simple/nested-for-loops_m5.js',
    'conformance-tests/statements/for-loops/simple/nested-for-loops-modifying_m5.js',
    'conformance-tests/statements/for-loops/complex/read-arr-index-only_m5.js',
    'conformance-tests/statements/for-loops/complex/write-arr-element-directly_m5.js',
    'conformance-tests/statements/for-loops/complex/write-arr-element-property-and-use-index_m5.js',
    'conformance-tests/statements/for-loops/complex/write-arr-element-property_m5.js',

    // Babel is formatting comments in unexpected ways. This tests whould pass onece we remove babel or change the way it's used
    'conformance-tests/comments/mixed-leading-trailing-comments_m5.js',

    // currently we cannot handle a comment spanning two different nodes (trailing and leading at the same time)
    'conformance-tests/comments/leading-and-trailing-comment_m5.js',
  ],
};
