// jest.config.js
require("dotenv").config(); // Load environment variables from .env

module.exports = {
  testEnvironment: "node", // Use Node.js as the test environment
  testMatch: ["**/__tests__/**/*.js"], // Look for tests in the "tests" folder
  collectCoverage: true, // Enable code coverage
  coverageDirectory: "coverage", // Directory for coverage reports
};
