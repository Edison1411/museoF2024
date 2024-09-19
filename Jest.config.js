module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'pages'],
  testMatch: ['**/?(*.)+(test).js?(x)'],
};
