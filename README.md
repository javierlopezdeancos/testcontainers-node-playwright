# testcontainers-node-playwright

[![Test](https://github.com/javierlopezdeancos/testcontainers-node-playwright/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/javierlopezdeancos/testcontainers-node-playwright/actions/workflows/test.yml)
![NPM Version](https://img.shields.io/npm/v/testcontainers-node-playwright)
![GitHub License](https://img.shields.io/github/license/javierlopezdeancos/testcontainers-node-playwright)

![Testcontainers logo](https://avatars.githubusercontent.com/u/13393021?s=48&v=4)
<img src="https://playwright.dev/img/playwright-logo.svg" alt="playwright logo" width="50"/>

Playwright module for [Testcontainers](https://testcontainers.com/)

[Playwright](https://playwright.dev/) is an [open source](https://github.com/microsoft/playwright) Microsoft
**end-to-end testing tool for modern web apps**. You can review the
Playwright documentation in the [Playwright official site](https://playwright.dev/docs/intro).

- [Features Implemented](#features-implemented)
- [Installation](#installation)
- [Example hello world app test helper](#example-hello-world-app-test)
- [How to use](#how-to-use)
  - [Start a playwright container](#start-a-playwright-container)
  - [Execute test in a Playwright container](#execute-test-in-a-playwright-container)
  - [Reporter](#reporter)
    - [Execute tests in a playwright container and read the dot reporter output](#execute-tests-in-a-playwright-container-and-read-the-dot-reporter-output)
    - [Execute tests in a playwright container and read the line reporter output](#execute-tests-in-a-playwright-container-and-read-the-line-reporter-output)
    - [Execute tests in a playwright container with default configuration and extract a html reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-html-reporter-with-results)
    - [Execute tests in a playwright container with default configuration and extract a json reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-json-reporter-with-results)
    - [Execute tests in a playwright container with default configuration and extract a blob reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-blob-reporter-with-results)
    - [Execute tests in a playwright container with default configuration and extract a junit reporter with results](#execute-tests-in-a-playwright-container-with-default-configuration-and-extract-a-junit-reporter-with-results)
  - [Trace viewer](#trace-viewer)
    - [Execute tests in a playwright container with default configuration that should fail and extract the trace viewer zip file](#execute-tests-in-a-playwright-container-with-default-configuration-that-should-fail-and-extract-the-trace-viewer-zip-file)
  - [Run playwright tests against your app](#run-playwright-tests-against-your-app)
    - [Run playwright tests in a playwright container pointed to your app container](#run-playwright-tests-in-a-playwright-container-pointer-to-your-your-app-container)
        - [Pointed to our hello world app example](#pointed-to-our-hello-world-app-example)

## Features Implemented

- Run Playwright tests in a playwright container.
  - [x] Run all Playwright tests in a playwright container.
  - [x] Run specific tests file in a playwright container.
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
        different reporters.
- Run Playwright tests against your app.
  - [x] Run Playwright tests in a playwright container against your app container.
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

## Example hello world app test

We have some helpers that allow us the testing module strategy.

```
.
└── testcontainers-node-playwright/
    └── src/
        └── example-hello-world-app-test/

```

A project generated by playwright cli that allow all infrastructure to run playwright test.
This project will be the one that will be mounted into the playwright container to execute its tests
pointed to `example-hello-world-app`

## How to use

### Start a playwright container

Playwright has official docker images in the [Microsoft Artifact Registry](https://mcr.microsoft.com/en-us/product/playwright/about)
that you can review to choose a tag.

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER,
).start();
```

### Execute test in a playwright container

```typescript
const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec(["npx", "playwright", "test"]);
```

### Reporter

Review the [Playwright reporter documentation](https://playwright.dev/docs/test-reporters) in order to know the available reporters and how you can notify
playwright which should be run and how.
Playwright has two different kind of reporters, the built-in reporters _(line, dot)_ and the external reporters
_(html, json, junit, blob)_.
You can set which reporter and how to run it, configuring the `playwright.config.js` file in your project.
To extract the reporter generated by our tests, you can use the `saveReporter` method from the `PlaywrightContainer`
class passing the type of reporter to extract and where do you want to extract it .

#### Execute tests in a playwright container and read the dot reporter output

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER,
).start();

const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=dot",
]);
```

#### Execute tests in a playwright container and read the line reporter output

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER,
).start();

const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
  "npx",
  "playwright",
  "test",
  "--reporter=line",
]);
```

#### Execute tests in a playwright container with default configuration and extract a html reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER,
).start();

const { output, exitCode } = await startedPlaywrightContainer.exec(["npx", "playwright", "test", "--reporter=html"]);

await startedPlaywrightContainer.saveReporter("html", externalDestinationReporterPath);
```

#### Execute tests in a playwright container with default configuration and extract a json reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER,
).start();

const { output, exitCode } = await startedPlaywrightContainer.exec(["npx", "playwright", "test", "--reporter=json"]);

await startedPlaywrightContainer.saveReporter("json", externalDestinationReporterPath);
```

#### Execute tests in a Playwright container with default configuration and extract a blob reporter with results

This functionality get some changes from [v1.44.0](https://github.com/javierlopezdeancos/testcontainers-node-playwright/pull/7#:~:text=at%20the%20changelog-,v1.44.0,-to%20the%20new) version or Playwright that introduce the blob report filename generation automatically adding a hash.

You can read more about in the official [blob-reporter](https://playwright.dev/docs/test-reporters#blob-reporter) playwright documentation section.

Those changes are reflected in the [PR #7](https://github.com/javierlopezdeancos/testcontainers-node-playwright/pull/7), taking a a workaround to get the blob reporter output filename for now, but that obviously will be removed in the future.

> [!CAUTION]
> This approach implies that you need to set the `PLAYWRIGHT_BLOB_OUTPUT_NAME` environment variable in the container with the name of the blob output file that you want to generate to be fixed and recoverable without need to read any `report-{hash}.zip` filename.

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER
)
.withEnvironment({ PLAYWRIGHT_BLOB_OUTPUT_NAME: "report.zip" })
.start();

const { output, exitCode } = await startedPlaywrightContainer.exec(["npx", "playwright", "test", "--reporter=blob"]);

await startedPlaywrightContainer.saveReporter("blob", externalDestinationReporterPath);
```

#### Execute tests in a Playwright container with default configuration and extract a junit reporter with results

```typescript
import path from "path";
import { PlaywrightContainer } from "@testcontainers/playwright";

const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.44.0-jammy";
const PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER = path.resolve(__dirname, "..", "example-project");
const PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");

const externalDestinationReporterPath = path.resolve(PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  PLAYWRIGHT_PROJECT_TESTS_TO_RUN_INTO_THE_CONTAINER,
).start();

const { output, exitCode } = await startedPlaywrightContainer.exec(["npx", "playwright", "test", "--reporter=junit"]);

await startedPlaywrightContainer.saveReporter("junit", externalDestinationReporterPath);
```

### Trace viewer

Review the [Playwright trace viewer documentation](https://playwright.dev/docs/trace-viewer-intro) in order to know the available reporters and how you can notify playwright which should be run and how.

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

### Run playwright tests against your app

We have seen how to run a playwright container, mount and execute some tests against an application already
deployed on the web but, the interesting use case is how we can do the same to execute the same tests against another
container that is running the web application that we want to test in our same environment.

#### Run playwright tests in a playwright container pointed to your app container

##### Pointed to our hello world app example

To testing purposes we are using an image that allow us run a container with a simple web server that serve
a simple html with some vanilla javascript behavior.
This app has the [source code](https://github.com/javierlopezdeancos/example-hello-world-app?tab=readme-ov-file) and the
[docker image pushed](https://hub.docker.com/repository/docker/javierland/example-hello-world-app/general) to use
it here as container application to check if the playwright container can pass its tests.

You can identify how we create and start this container in `playwright-container.test.ts` file:

```typescript
const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.43.0-jammy";
const HELLO_WORLD_APP_IMAGE = "javierland/example-hello-world-app:latest";

const EXTERNAL_HELLO_WORLD_APP_PORT_TO_BE_TESTED = "3000";
const EXTERNAL_HELLO_WORLD_APP_ALIAS_TO_BE_TESTED = "hello-world-app";

const network: Network = new Network();
const startedNetwork = await network.start();

const helloWorldAppStartedContainer = await new GenericContainer(HELLO_WORLD_APP_IMAGE)
  .withNetwork(startedNetwork)
  .withNetworkAliases(EXTERNAL_HELLO_WORLD_APP_ALIAS_TO_BE_TESTED)
  .withExposedPorts(parseInt(EXTERNAL_HELLO_WORLD_APP_PORT_TO_BE_TESTED, 10))
  .withWaitStrategy(
    Wait.forHttp("/health", parseInt(EXTERNAL_HELLO_WORLD_APP_PORT_TO_BE_TESTED, 10)).forStatusCodeMatching(
      (statusCode: number): boolean => statusCode === 200,
    ),
  )
  .start();

await helloWorldAppStartedContainer.exec(["npx", "start"]);

const startedPlaywrightContainer = await new PlaywrightContainer(
  PLAYWRIGHT_IMAGE,
  EXTERNAL_HELLO_WORLD_APP_TESTS_DIRECTORY,
)
  .withNetwork(startedNetwork)
  .withEnvironment({
    APP_CONTAINER_URL_TO_GO_TO: EXTERNAL_HELLO_WORLD_APP_URL_TO_BE_TESTED,
  })
  .start();

const { output, exitCode } = await startedPlaywrightContainer.exec([
  "npx",
  "playwright",
  "test",
  "tests/example-success.spec.ts",
  "--reporter=dot",
]);

await startedPlaywrightContainer.stop();
await helloWorldAppStartedContainer.stop();
await startedNetwork.stop();
```
> [!NOTE]
> Take into account that we should start the `helloWorldAppStartedContainer` with a started network that we should add
> too into the playwright container initialization to be able the containers communication.
> In addition to the two containers being on the same network, the [easiest way for testcontainers to help in
> containers communication](https://node.testcontainers.org/features/networking/#network-aliases) is to set up an alias for each container that we want to reference.

> [!NOTE]
> Take into account that you should reference into `APP_CONTAINER_URL_TO_GO_TO` env var in your playwright test
> to be executed against your app container.

So, in your playwright test file:
```typescript
// ...

const { APP_CONTAINER_URL_TO_GO_TO = "http://localhost:3000" } = process.env;

test("should blablabla", async ({ page }) => {
  await page.goto(APP_CONTAINER_URL_TO_GO_TO);

  // ...
});

```
