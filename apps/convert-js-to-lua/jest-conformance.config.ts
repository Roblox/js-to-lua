export default {
  displayName: 'convert-js-to-lua',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/convert-js-to-lua',
  testMatch: [
    '**/conformance-tests/**/__tests__/**/*.[jt]s?(x)',
    '**/conformance-tests/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};
