module.exports = {
  displayName: 'convert-js-to-lua',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/convert-js-to-lua',
  testPathIgnorePatterns: ['/node_modules', 'conformance-tests'],
  testEnvironment: 'node',
};
