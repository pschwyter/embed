module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|scss|less)$": "identity-obj-proxy",
    "^react$": "preact-compat",
    "^react-dom$": "preact-compat",
    "^models(.*)$": "<rootDir>/src/models$1",
    "^services(.*)$": "<rootDir>/src/services$1",
    "^style(.*)$": "<rootDir>/src/style$1",
    "^constants(.*)$": "<rootDir>/src/constants$1"
  },
  setupTestFrameworkScriptFile: "<rootDir>/test/setup.js",
  setupFiles: [
    "jest-localstorage-mock"
  ],
  "globals": {
    "window": true
  },
  "snapshotSerializers": [ "preact-render-spy/snapshot" ]
};
