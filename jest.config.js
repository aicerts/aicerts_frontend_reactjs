
// jest.config.js
module.exports = {
    // Other Jest configurations...
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    // Add this option to handle ES modules
    testEnvironment: 'jsdom',
  };
  