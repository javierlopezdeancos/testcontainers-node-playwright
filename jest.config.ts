import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  modulePathIgnorePatterns: [
    "<rootDir>/src/example-hello-world-app/",
    "<rootDir>/src/example-hello-world-app-tests/",
    "<rootDir>/build/",
  ],
};

export default config;
