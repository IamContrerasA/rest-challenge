module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/{!(server),}.ts'],
  coverageThreshold: {
    'src/**/{!(server),}.ts': {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}
