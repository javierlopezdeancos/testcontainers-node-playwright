# testcontainers-node-playwright
![NPM Version](https://img.shields.io/npm/v/testcontainers-node-playwright)
![GitHub License](https://img.shields.io/github/license/javierlopezdeancos/testcontainers-node-playwright)

Playwright module for [Testcontainers](https://testcontainers.com/)

[Playwright](https://playwright.dev/) is an [open source](https://github.com/microsoft/playwright) Microsoft
**end-to-end testing tool for modern web apps**. You can review the
Playwright documentation in the [Playwright official site](https://playwright.dev/docs/intro).

- [Features Implemented](#features-implemented)
- [Installation](#installation)
- [How to use](#how-to-use)
  - [Start a Playwright container](#start-a-playwright-container)
  - [Execute test in a Playwright container](#execute-test-in-a-playwright-container)
  - [Reporter](#reporter)
    - [Execute tests in a Playwright container and read the dot reporter output](#execute-tests-in-a-playwright-container-and-read-the-dot-reporter-output)
    - [Execute tests in a Playwright container and read the line reporter output](#execute-tests-in-a-playwright-container-and-read-the-line-reporter-output)
    - [Execute tests in a Playwright container with default configuration and extract a html reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-html-reporter-with-results)
    - [Execute tests in a Playwright container with default configuration and extract a json reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-json-reporter-with-results)
    - [Execute tests in a Playwright container with default configuration and extract a blob reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-blob-reporter-with-results)
    - [Execute tests in a Playwright container with default configuration and extract a junit reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-junit-reporter-with-results)
  - [Traces](#traces)
    - [Execute tests in a playwright container with default configuration that should fail and extract the trace viewer zip file](#execute-tests-in-a-playwright-container-with-default-configuration-that-should-fail-and-extract-the-trace-viewer-zip-file)

## Features Implemented

- Run Playwright tests in a playwright container.
    - [x] Run all Playwright tests in a playwright container.
    - [ ] Run specific tests in a playwright container.
- Run Playwright tests in a playwright container and extract the reporter results.
    - [x] Run Playwright tests in a playwright container and read the output line reporter.
    - [x] Run Playwright tests in a playwright container and read the output dot reporter.
    - [x] Run Playwright tests in a playwright container with default configuration and extract the html reporter.
    - [ ] Run Playwright tests in a playwright container with default configuration and open the html reporter.
    - [x] Run Playwright tests in a playwright container with default configuration and extract the json reporter.
    - [x] Run Playwright tests in a playwright container with default configuration and extract the junit reporter.
    - [x] Run Playwright tests in a playwright container with default configuration and extract the blob reporter.
    - [ ] Run Playwright tests in a playwright container with default configuration and extract a list of
      different kind of reporter.
- Run Playwright tests against your app.
    - [ ] Run Playwright tests in a playwright container against your app container.
- Run Playwright test in UI mode.
    - [ ] Run Tests in UI Mode that user can follow up outside the container using a browser.
- Run Playwright and extract trace viewer on failed test.
    - [x] Run Playwright tests in a playwright container with default configuration that should fail and extract the
          trace viewer zip file.
- Debugging Playwright tests.
    - [ ] Debugging Playwright tests with the Playwright inspector in a Playwright container.

## Installation
```bash
npm install testcontainers-node-playwright --save-dev
```

## How to use

### Start a Playwright container

Playwright has official docker images in the [Microsoft Artifact Registry](https://mcr.microsoft.com/en-us/product/playwright/about)
that you can review to choose a tag.

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
).start();
```

### Execute test in a Playwright container

```typescript
const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
    "npx",
    "playwright",
    "test",
  ]);
```

### Reporter

Review the [Playwright reporter documentation](https://playwright.dev/docs/test-reporters) in order to know the available reporters and how you can notify
playwright which should be run and how.
Playwright has two different kind of reporters, the built-in reporters *(line, dot)* and the external reporters
*(html, json, junit, blob)*.
You can set which reporter and how to run it, configuring the `playwright.config.js` file in your project.
To extract the reporter generated by our tests, you can use the `saveReporter` method from the `PlaywrightContainer`
class passing the type of reporter to extract and where do you want to extract it .

#### Execute tests in a Playwright container and read the dot reporter output

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
).start();

const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=dot",
]);
```

#### Execute tests in a Playwright container and read the line reporter output

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
).start();

const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=line",
]);
```

#### Execute tests in a Playwright container with default configuration and extract a html reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
)
.start();

const { output, exitCode } = await startedPlaywrightContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=html",
]);

await startedPlaywrightContainer.saveReporter("html", externalDestinationReporterPath);
```

#### Execute tests in a Playwright container with default configuration and extract a json reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
)
.start();

const { output, exitCode } = await startedPlaywrightContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=json",
]);

await startedPlaywrightContainer.saveReporter("json", externalDestinationReporterPath);
```

#### Execute tests in a Playwright container with default configuration and extract a blob reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
)
.start();

const { output, exitCode } = await startedPlaywrightContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=blob",
]);

await startedPlaywrightContainer.saveReporter("blob", externalDestinationReporterPath);
```
#### Execute tests in a Playwright container with default configuration and extract a junit reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
)
.start();

const { output, exitCode } = await startedPlaywrightContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=junit",
]);

await startedPlaywrightContainer.saveReporter("junit", externalDestinationReporterPath);
```

### Trace viewer

Review the [Playwright trace viewer documentation](https://playwright.dev/docs/trace-viewer-intro) in order to know the available reporters and how you can notify
playwright which should be run and how.

#### Execute tests in a playwright container with default configuration that should fail and extract the trace viewer zip file

```typescript
import { PlaywrightContainer, BROWSER } from "./playwright-container";

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
).start();

const { exitCode } = await startedPlaywrightContainer.exec([
  "npx",
  "playwright",
  "test",
  "tests/example-fail.spec.ts",
  "--trace",
  "on",
]);

const TEST_FAILED_NAME_GET_STARTED_LINK_IN_KEBAB_CASE = "example-fail-get-started-link";

const browsers = ["chromium", "firefox", "webkit"];

await startedPlaywrightContainer.saveTraceViewer(
  browsers,
  TEST_FAILED_NAME_GET_STARTED_LINK_IN_KEBAB_CASE,
  EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY,
);

await startedPlaywrightContainer.stop();
```

