module.exports = {
  displayName: 'convert-js-to-lua',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/convert-js-to-lua',
  testMatch: [
    '**/conformance-tests/**/__tests__/**/*.[jt]s?(x)',
    '**/conformance-tests/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};
