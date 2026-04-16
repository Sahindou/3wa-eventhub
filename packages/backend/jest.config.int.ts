export default {
  collectCoverage: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '\\.int\\.test\\.ts$',
  testTimeout: 8 * 1000,
  maxWorkers: 1,
}
