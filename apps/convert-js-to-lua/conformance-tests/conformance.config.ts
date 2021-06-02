export default {
  outputPath: './dist/output-tests/',
  inputPath: './conformance-tests',
  excludeFiles: [
    // ---- Milestone 1 ----
    'conformance-tests/base-types/strings/template-escape-new-line.js',
    'conformance-tests/base-types/strings/escape-sequences.js',
    'conformance-tests/base-types/strings/hex-escape-sequences.js',
    'conformance-tests/base-types/strings/octal-escape-sequence-follow-by-8.js',
    'conformance-tests/base-types/strings/octal-escape-sequences.js',
    'conformance-tests/structural-types/object/single-false-key-to-boolean.js',

    // ---- Milestone 2 ----
    'conformance-tests/expressions/call/method-expression-string_m2.js',
    'conformance-tests/expressions/call/method-expression_m2.js',
    'conformance-tests/expressions/call/method-react-create-div-element_m2.js',
    'conformance-tests/expressions/call/method-nested_m2.js',
    'conformance-tests/expressions/call/method-to-string_m2.js',
    'conformance-tests/expressions/call/method-to-string-nested_m2.js',
    'conformance-tests/expressions/call/method_m2.js',

    'conformance-tests/operators/unary/delete/basic_m2.js',
    'conformance-tests/operators/unary/delete/computed-basic_m2.js',
    'conformance-tests/operators/unary/delete/computed-boolean_m2.js',
    'conformance-tests/operators/unary/delete/computed-expression_m2.js',
    'conformance-tests/operators/unary/delete/computed-identifier_m2.js',
    'conformance-tests/operators/unary/delete/computed-numeric_m2.js',
    'conformance-tests/operators/unary/delete/computed-octal_m2.js',

    'conformance-tests/complex/simple-react-component_m2.js',
  ],
};
