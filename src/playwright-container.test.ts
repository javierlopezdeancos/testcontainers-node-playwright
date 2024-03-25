import path from "node:path";
import { existsSync } from "node:fs";
import { PlaywrightContainer, BROWSER } from "./playwright-container";

describe("PlaywrightContainer", () => {
  jest.setTimeout(180_000);

  const PLAYWRIGHT_IMAGE = "mcr.microsoft.com/playwright:v1.42.1-jammy";
  const EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY = path.resolve(__dirname, "..", "example-reports");
  const EXTERNAL_PLAYWRIGHT_SAVE_TRACES_DIRECTORY = path.resolve(__dirname, "..", "example-results");
  const EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY = path.resolve(__dirname, "example-project");

  const SUCCESSFUL_TEST_RUNNING_OUTPUT = "Running";
  const SUCCESSFUL_TEST_PASSED_OUTPUT = "passed";
  const SUCCESSFUL_TEST_EXIT_CODE = 0;
  const FAILED_TEST_EXIT_CODE = 1;

  it(`should pass example tests with a dot build in reporter`, async () => {
    const startedPlaywrightBuildInReporterContainer = await new PlaywrightContainer(
      PLAYWRIGHT_IMAGE,
      EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
    ).start();

    const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
      "npx",
      "playwright",
      "test",
      "tests/example-success.spec.ts",
      "--reporter=dot",
    ]);

    await startedPlaywrightBuildInReporterContainer.stop();

    expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
    expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
    expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
  });

  it(`should pass example tests with a line build in reporter`, async () => {
    const startedPlaywrightBuildInReporterContainer = await new PlaywrightContainer(
      PLAYWRIGHT_IMAGE,
      EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
    ).start();

    const { output, exitCode } = await startedPlaywrightBuildInReporterContainer.exec([
      "npx",
      "playwright",
      "test",
      "tests/example-success.spec.ts",
      "--reporter=line",
    ]);

    await startedPlaywrightBuildInReporterContainer.stop();

    expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
    expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
    expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
  });

  it(`should pass example tests creating an html reporter`, async () => {
    const externalDestinationReporterPath = path.resolve(EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "index.html");

    const startedPlaywrightContainer = await new PlaywrightContainer(
      PLAYWRIGHT_IMAGE,
      EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
    )
      .withEnvironment({ PLAYWRIGHT_HTML_REPORT: "test-reports" })
      .start();

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

    await startedPlaywrightContainer.stop();
  });

  it(`should pass example tests creating a json reporter`, async () => {
    const externalDestinationReporterPath = path.resolve(EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, "results.json");

    const startedPlaywrightContainer = await new PlaywrightContainer(
      PLAYWRIGHT_IMAGE,
      EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
    )
      .withEnvironment({ PLAYWRIGHT_JSON_OUTPUT_NAME: "results.json" })
      .start();

    const { output, exitCode } = await startedPlaywrightContainer.exec([
      "npx",
      "playwright",
      "test",
      "tests/example-success.spec.ts",
      "--reporter=json",
    ]);

    await startedPlaywrightContainer.saveReporter("json", externalDestinationReporterPath);
    await startedPlaywrightContainer.stop();

    expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
    expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
    expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
    expect(existsSync(externalDestinationReporterPath)).toBe(true);
  });

  it(`should pass example tests creating a bob reporter`, async () => {
    const externalDestinationReporterPath = path.resolve(
      EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY,
      `report-${process.arch}.zip`,
    );

    const startedPlaywrightContainer = await new PlaywrightContainer(
      PLAYWRIGHT_IMAGE,
      EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
    ).start();

    const { output, exitCode } = await startedPlaywrightContainer.exec([
      "npx",
      "playwright",
      "test",
      "tests/example-success.spec.ts",
      "--reporter=blob",
    ]);

    await startedPlaywrightContainer.saveReporter("blob", externalDestinationReporterPath);
    await startedPlaywrightContainer.stop();

    expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
    expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
    expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
    expect(existsSync(externalDestinationReporterPath)).toBe(true);
  });

  it(`should pass example tests creating a junit reporter`, async () => {
    const externalDestinationReporterPath = path.resolve(EXTERNAL_PLAYWRIGHT_SAVE_REPORTS_DIRECTORY, `results.xml`);

    const startedPlaywrightContainer = await new PlaywrightContainer(
      PLAYWRIGHT_IMAGE,
      EXTERNAL_PLAYWRIGHT_PROJECT_DIRECTORY,
    )
      .withEnvironment({ PLAYWRIGHT_JUNIT_OUTPUT_NAME: "results.xml" })
      .start();

    const { output, exitCode } = await startedPlaywrightContainer.exec([
      "npx",
      "playwright",
      "test",
      "tests/example-success.spec.ts",
      "--reporter=junit",
    ]);

    await startedPlaywrightContainer.saveReporter("junit", externalDestinationReporterPath);
    await startedPlaywrightContainer.stop();

    expect(output).toContain(SUCCESSFUL_TEST_RUNNING_OUTPUT);
    expect(output).toContain(SUCCESSFUL_TEST_PASSED_OUTPUT);
    expect(exitCode).toBe(SUCCESSFUL_TEST_EXIT_CODE);
    expect(existsSync(externalDestinationReporterPath)).toBe(true);
  });

  it("should set a trace on first retry", async () => {
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

    await startedPlaywrightContainer.stop();

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
  });
});
