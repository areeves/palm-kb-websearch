module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/src/**/*.test.js', '**/src/**/*.test.ts'],
};