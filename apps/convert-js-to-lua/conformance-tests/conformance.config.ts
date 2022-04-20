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

    'conformance-tests/statements/for-loops/simple/continue/single-for-loop_m5.js',
    'conformance-tests/statements/for-loops/simple/continue/single-for-loop-modifying_m5.js',
    'conformance-tests/statements/for-loops/simple/continue/nested-for-loops_m5.js',
    'conformance-tests/statements/for-loops/simple/continue/nested-for-loops-modifying_m5.js',

    // Babel is formatting comments.
    'conformance-tests/comments/mixed-leading-trailing-comments_m5.js',
    'conformance-tests/comments/leading-and-trailing-comment_m5.js',
    'conformance-tests/comments/leading-and-trailing-comment-complex_m5.ts',

    // requires handling of TSParenthesizedType
    'conformance-tests/ts-types/intersection/ts-intersection-type-multiple-mixed-union_m5.ts',

    // TODO: convert a bit smarter when applying to ArrayExpressions
    'conformance-tests/expressions/call/known-array-methods/definitely-array/push-single-apply_m5.js',
    'conformance-tests/expressions/call/known-array-methods/definitely-array/unshift-multiple-apply_m5.js',
    'conformance-tests/expressions/call/known-array-methods/definitely-array/unshift-single-apply_m5.js',
    'conformance-tests/expressions/call/known-array-methods/maybe-array/push-single-apply_m5.js',
    'conformance-tests/expressions/call/known-array-methods/maybe-array/unshift-multiple-apply_m5.js',
    'conformance-tests/expressions/call/known-array-methods/maybe-array/unshift-single-apply_m5.js',

    // TODO: handle ObjectTypeAnnotation https://github.com/Roblox/js-to-lua/issues/501
    'conformance-tests/flow-types/union/union-type-annotation-complex_m6.js',
  ],
};
