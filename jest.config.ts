import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  modulePathIgnorePatterns: ["<rootDir>/src/example-project/", "<rootDir>/build/"],
};

export default config;
