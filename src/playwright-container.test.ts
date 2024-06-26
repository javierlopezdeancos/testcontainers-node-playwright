import path from "node:path";
import { existsSync } from "node:fs";
import { Network, GenericContainer, StartedTestContainer, StartedNetwork } from "testcontainers";
import {
  PlaywrightContainer,
  StartedPlaywrightContainer,
  BROWSER,
  DEFAULT_PLAYWRIGHT_CONTAINER_IMAGE,
  DEFAULT_JSON_REPORTER_FILE,
  DEFAULT_BLOB_REPORTER_FILE,
  DEFAULT_JUNIT_REPORTER_FILE,
  DEFAULT_HTML_REPORTER_OUTPUT_DIRECTORY,
} from "./playwright-container";

describe("PlaywrightContainer", () => {
  const TEST_TIMEOUT = 260_000;

  const HELLO_WORLD_APP_IMAGE = "javierland/example-hello-world-app:latest";

  const EXTERNAL_HELLO_WORLD_APP_PORT_TO_BE_TESTED = 3000;

  const EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");
  const EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY = path.resolve(__dirname, "..", "example-results");
  const EXTERNAL_HELLO_WORLD_APP_TESTS_DIRECTORY = path.resolve(__dirname, "example-hello-world-app-tests");

  const SUCCESSFUL_TEST_RUNNING_OUTPUT = "Running";
  const SUCCESSFUL_TEST_PASSED_OUTPUT = "passed";
  const SUCCESSFUL_TEST_EXIT_CODE = 0;
  const FAILED_TEST_EXIT_CODE = 1;

  const network: Network = new Network();

  let startedNetwork: StartedNetwork;
  let helloWorldAppStartedContainer: StartedTestContainer;
  let startedPlaywrightContainer: StartedPlaywrightContainer;

  beforeAll(async () => {
    startedNetwork = await network.start();

    helloWorldAppStartedContainer = await new GenericContainer(HELLO_WORLD_APP_IMAGE)
      .withNetwork(startedNetwork)
      .withExposedPorts(EXTERNAL_HELLO_WORLD_APP_PORT_TO_BE_TESTED)
      .start();

    const helloWorldAppStartedContainerIpAddress = helloWorldAppStartedContainer.getIpAddress(startedNetwork.getName());

    startedPlaywrightContainer = await new PlaywrightContainer(
      DEFAULT_PLAYWRIGHT_CONTAINER_IMAGE,
      EXTERNAL_HELLO_WORLD_APP_TESTS_DIRECTORY,
    )
      .withNetwork(startedNetwork)
      .withEnvironment({
        APP_CONTAINER_URL_TO_GO_TO: `http://${helloWorldAppStartedContainerIpAddress}:${EXTERNAL_HELLO_WORLD_APP_PORT_TO_BE_TESTED}`,
        PLAYWRIGHT_HTML_REPORT: DEFAULT_HTML_REPORTER_OUTPUT_DIRECTORY,
        PLAYWRIGHT_JSON_OUTPUT_NAME: DEFAULT_JSON_REPORTER_FILE,
        PLAYWRIGHT_JUNIT_OUTPUT_NAME: DEFAULT_JUNIT_REPORTER_FILE,
        PLAYWRIGHT_BLOB_OUTPUT_NAME: DEFAULT_BLOB_REPORTER_FILE,
      })
      .start();
  }, TEST_TIMEOUT);

  it(
    `should pass example tests with a dot build in reporter`,
    async () => {
      const { output, exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-success.spec.ts",
        "--reporter=dot",
      ]);

      expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
      expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
      expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
    },
    TEST_TIMEOUT,
  );

  it(
    `should pass example tests with a line build in reporter`,
    async () => {
      const { output, exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-success.spec.ts",
        "--reporter=line",
      ]);

      expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
      expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
      expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
    },
    TEST_TIMEOUT,
  );

  it(
    `should pass example tests creating an html reporter`,
    async () => {
      const externalDestinationReporterPath = path.resolve(EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

      const { output, exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-success.spec.ts",
        "--reporter=html",
      ]);

      await startedPlaywrightContainer.saveReporter("html", externalDestinationReporterPath);

      expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
      expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
      expect(output).toContain("To open last HTML report run");
      expect(output).toContain("npx playwright show-report");
      expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
      expect(existsSync(externalDestinationReporterPath)).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    `should pass example tests creating a json reporter`,
    async () => {
      const externalDestinationReporterPath = path.resolve(EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "results.json");

      const { output, exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-success.spec.ts",
        "--reporter=json",
      ]);

      await startedPlaywrightContainer.saveReporter("json", externalDestinationReporterPath);

      expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
      expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
      expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
      expect(existsSync(externalDestinationReporterPath)).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    `should pass example tests creating a bob reporter`,
    async () => {
      const externalDestinationReporterPath = path.resolve(
        EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY,
        `report-${process.arch}.zip`,
      );

      const { output, exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-success.spec.ts",
        "--reporter=blob",
      ]);

      await startedPlaywrightContainer.saveReporter("blob", externalDestinationReporterPath);

      expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
      expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
      expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
      expect(existsSync(externalDestinationReporterPath)).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    `should pass example tests creating a junit reporter`,
    async () => {
      const externalDestinationReporterPath = path.resolve(EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, `results.xml`);

      const { output, exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-success.spec.ts",
        "--reporter=junit",
      ]);

      await startedPlaywrightContainer.saveReporter("junit", externalDestinationReporterPath);

      expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
      expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
      expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
      expect(existsSync(externalDestinationReporterPath)).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "should fail example test creating a trace viewer by browser on first retry",
    async () => {
      const { exitCode } = await startedPlaywrightContainer.exec([
        "npx",
        "playwright",
        "test",
        "tests/example-fail.spec.ts",
        "--trace",
        "on",
      ]);

      const TEST_FAILED_NAME_GET_STARTED_LINK_IN_KEBAB_CASE = "example-fail-get-started-link";
      const TEST_FAILED_NAME_HAS_TITLE_IN_KEBAB_CASE = "example-fail-has-title";

      const browsers = Object.values(BROWSER);

      await startedPlaywrightContainer.saveTraceViewer(
        browsers,
        TEST_FAILED_NAME_GET_STARTED_LINK_IN_KEBAB_CASE,
        EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY,
      );

      await startedPlaywrightContainer.saveTraceViewer(
        browsers,
        TEST_FAILED_NAME_HAS_TITLE_IN_KEBAB_CASE,
        EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY,
      );

      expect(exitCode).toBe(FAILED_TEST_EXIT_CODE);

      for (const browser of browsers) {
        const externalTraceViewerDestinationToGetStartedLinkTestFailed = path.resolve(
          EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY,
          `example-fail-get-started-link-${browser}`,
          "trace.zip",
        );

        const externalTraceViewerDestinationToHasTitleTestFailed = path.resolve(
          EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY,
          `example-fail-get-started-link-${browser}`,
          "trace.zip",
        );

        expect(existsSync(externalTraceViewerDestinationToGetStartedLinkTestFailed)).toBe(true);
        expect(existsSync(externalTraceViewerDestinationToHasTitleTestFailed)).toBe(true);
      }
    },
    TEST_TIMEOUT,
  );

  afterAll(async () => {
    await startedPlaywrightContainer.stop();
    await helloWorldAppStartedContainer.stop();
    await startedNetwork.stop();
  }, TEST_TIMEOUT);
});
