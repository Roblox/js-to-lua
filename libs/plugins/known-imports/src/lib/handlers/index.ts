import {
  renameNestedImport,
  renameSimpleImport,
  RequireCallHandler,
} from './utils';

export const knownRequiresHandlers: Array<RequireCallHandler> = [
  // Jest
  renameSimpleImport('diff-sequences', 'DiffSequences'),
  renameSimpleImport('expect', 'Expect'),
  renameSimpleImport('jest-circus', 'JestCircus'),
  renameSimpleImport('jest-cli', 'JestCli'),
  renameSimpleImport('jest-config', 'JestConfig'),
  renameNestedImport(['@jest', 'console'], 'JestConsole'),
  renameNestedImport(['@jest', 'core'], 'JestCore'),
  renameSimpleImport('jest-diff', 'JestDiff'),
  renameSimpleImport('jest-each', 'JestEach'),
  renameNestedImport(['@jest', 'environment'], 'JestEnvironment'),
  renameNestedImport(['@jest', 'expect'], 'Expect'),
  renameNestedImport(['@jest', 'fake-timers'], 'JestFakeTimers'),
  renameSimpleImport('jest-get-type', 'JestGetType'),
  renameNestedImport(['@jest', 'globals'], 'JestGlobals', {
    devDependency: true,
  }),
  renameSimpleImport('jest-jasmine2', 'JestJasmine2'),
  renameSimpleImport('jest-matcher-utils', 'JestMatcherUtils'),
  renameSimpleImport('jest-message-util', 'JestMessageUtil'),
  renameSimpleImport('jest-mock', 'JestMock'),
  renameNestedImport(['@jest', 'reporters'], 'JestReporters'),
  renameSimpleImport('jest-runner', 'JestRunner'),
  renameSimpleImport('jest-runtime', 'JestRuntime'),
  renameSimpleImport('jest-snapshot', 'JestSnapshot'),
  renameNestedImport(['@jest', 'test-result'], 'JestTestResult'),
  renameNestedImport(['@jest', 'types'], 'JestTypes'),
  renameSimpleImport('jest-util', 'JestUtil'),
  renameSimpleImport('jest-validate', 'JestValidate'),
  renameSimpleImport('jest', 'Jest'),
  renameSimpleImport('pretty-format', 'PrettyFormat'),
  // React
  renameSimpleImport('react', 'React'),
  // GraphQL
  renameSimpleImport('graphql', 'GraphQL'),
  renameSimpleImport('graphql-tag', 'GraphqlTag'),
  renameNestedImport(['@apollo', 'client'], 'ApolloClient'),
  // Testing Library
  renameNestedImport(['@testing-library', 'dom'], 'DomTestingLibrary'),
  renameNestedImport(['@testing-library', 'react'], 'ReactTestingLibrary'),
  // Other
  renameSimpleImport('emittery', 'Emittery'),
  renameSimpleImport('picomatch', 'Picomatch'),
];
