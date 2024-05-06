import { copyFile, rm } from "node:fs/promises";
import path from "node:path";
import tar from "tar-fs";
import tmp from "tmp";
import { existsSync, mkdirSync } from "node:fs";

import {
  AbstractStartedContainer,
  AbstractStoppedContainer,
  GenericContainer,
  StartedTestContainer,
  StopOptions,
  StoppedTestContainer,
  log,
} from "testcontainers";

const CONTAINER_WORKING_DIRECTORY = "/playwright";
const DEFAULT_JSON_REPORTER_FILE = "results.json";
const DEFAULT_HTML_REPORTER_OUTPUT_DIRECTORY = "test-reports";
const DEFAULT_HTML_REPORTER_FILE = "index.html";
const DEFAULT_BLOB_REPORTER_FILE = "report.zip";
const DEFAULT_BLOB_REPORTER_OUTPUT_DIRECTORY = "blob-report";
const DEFAULT_JUNIT_REPORTER_FILE = "results.xml";
const DEFAULT_TRACE_VIEWER_OUTPUT_DIRECTORY = "test-results";
const DEFAULT_TRACE_VIEWER_FILE = "trace.zip";

export const BROWSER = {
  CHROMIUM: "chromium",
  FIREFOX: "firefox",
  WEBKIT: "webkit",
} as const;

type Browser = (typeof BROWSER)[keyof typeof BROWSER];

const EXPORTABLE_REPORTER_TYPE = {
  JSON: "json",
  HTML: "html",
  BLOB: "blob",
  JUNIT: "junit",
} as const;

type ExportableReporterType = (typeof EXPORTABLE_REPORTER_TYPE)[keyof typeof EXPORTABLE_REPORTER_TYPE];

export class PlaywrightContainer extends GenericContainer {
  constructor(
    image = "mcr.microsoft.com/playwright:v1.43.1-jammy",
    externalPlaywrightTestsDirectoryToCopyIntoContainerWorkingDirectory: string,
  ) {
    super(image);

    this.directoriesToCopy = [
      {
        source: externalPlaywrightTestsDirectoryToCopyIntoContainerWorkingDirectory,
        target: CONTAINER_WORKING_DIRECTORY,
        mode: 755,
      },
    ];
  }

  protected override async beforeContainerCreated(): Promise<void> {
    this.withWorkingDir(CONTAINER_WORKING_DIRECTORY)
      .withCopyDirectoriesToContainer(this.directoriesToCopy)
      .withEntrypoint(["/bin/sleep"])
      .withCommand(["infinity"]);
  }

  override async start(): Promise<StartedPlaywrightContainer> {
    const startedTestContainer = await super.start();
    const { output, exitCode } = await startedTestContainer.exec(["npm", "i"]);

    if (exitCode !== 0) {
      throw new Error(`Playwright container installing dependencies failed with exit code ${exitCode}: ${output}`);
    }

    return new StartedPlaywrightContainer(startedTestContainer);
  }
}

export class StartedPlaywrightContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
  }

  private async extractTarStreamToDestination(tarStream: NodeJS.ReadableStream, dest: string): Promise<void> {
    await new Promise<void>((resolve) => {
      const destination = tar.extract(dest);
      tarStream.pipe(destination);
      destination.on("finish", resolve);
    });
  }

  private createDirectoryIfNotExists(directoryPath: string): void {
    if (existsSync(directoryPath)) {
      return;
    }

    log.debug(`Creating directory path "${directoryPath}" that not exists...`);
    mkdirSync(directoryPath);
    log.debug(`Created directory path "${directoryPath}" that not exists`);
  }

  private async removeFileIfExists(filePath: string): Promise<void> {
    if (!existsSync(filePath)) {
      return;
    }

    log.debug(`Removing file "${filePath}" that exist...`);
    await rm(filePath);
    log.debug(`Removed file "${filePath}" that exist`);
  }

  private getContainerReporterFile(exportableReporterType: ExportableReporterType): string {
    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.HTML) {
      return DEFAULT_HTML_REPORTER_FILE;
    }

    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.JSON) {
      return DEFAULT_JSON_REPORTER_FILE;
    }

    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.BLOB) {
      return DEFAULT_BLOB_REPORTER_FILE;
    }

    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.JUNIT) {
      return DEFAULT_JUNIT_REPORTER_FILE;
    }

    return "";
  }

  private getReporterPath(exportableReporterType: ExportableReporterType): string {
    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.HTML) {
      return path.format({
        root: "/ignored",
        dir: `${CONTAINER_WORKING_DIRECTORY}/${DEFAULT_HTML_REPORTER_OUTPUT_DIRECTORY}`,
        base: DEFAULT_HTML_REPORTER_FILE,
      });
    }

    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.JSON) {
      return path.join(CONTAINER_WORKING_DIRECTORY, DEFAULT_JSON_REPORTER_FILE);
    }

    if (exportableReporterType === EXPORTABLE_REPORTER_TYPE.BLOB) {
      return path.format({
        root: "/ignored",
        dir: `${CONTAINER_WORKING_DIRECTORY}/${DEFAULT_BLOB_REPORTER_OUTPUT_DIRECTORY}`,
        base: DEFAULT_BLOB_REPORTER_FILE,
      });
    }

    // if exportable reporter type is junit
    return path.format({
      root: "/ignored",
      dir: `${CONTAINER_WORKING_DIRECTORY}`,
      base: DEFAULT_JUNIT_REPORTER_FILE,
    });
  }

  private getTracesPathsByBrowserAndTestFailedTitle(browsers: Browser[], testFailingName: string): string[] {
    const traceViewerPaths: string[] = [];

    for (const browser of browsers) {
      const traceViewerPath = path.format({
        root: "/ignored",
        dir: `${CONTAINER_WORKING_DIRECTORY}/${DEFAULT_TRACE_VIEWER_OUTPUT_DIRECTORY}/${testFailingName}-${browser}`,
        base: DEFAULT_TRACE_VIEWER_FILE,
      });

      traceViewerPaths.push(traceViewerPath);
    }

    return traceViewerPaths;
  }

  public async saveReporter(
    exportableReporterType: ExportableReporterType,
    destinationReporterPath: string,
  ): Promise<void> {
    try {
      const containerId = this.getId();
      const reporterPath = this.getReporterPath(exportableReporterType);

      log.debug("Extracting archive from container...", { containerId });
      const archiveStream = await this.copyArchiveFromContainer(reporterPath);
      log.debug("Extracted archive from container", { containerId });

      log.debug("Unpacking archive...", { containerId });
      const destinationDir = tmp.dirSync({ keep: false });
      await this.extractTarStreamToDestination(archiveStream, destinationDir.name);
      log.debug("Unpacked archive", { containerId });

      const containerReporterFile = this.getContainerReporterFile(exportableReporterType);
      const sourceReporterPath = path.resolve(destinationDir.name, `${containerReporterFile}`);
      const destinationDirectoryPath = path.dirname(destinationReporterPath);

      this.createDirectoryIfNotExists(destinationDirectoryPath);
      await this.removeFileIfExists(destinationReporterPath);

      log.debug(`Copying report to "${destinationReporterPath}..."`);
      await copyFile(sourceReporterPath, destinationReporterPath, 1);
      log.debug(`Copy report to "${destinationReporterPath}"`);
    } catch (error) {
      log.error(`${error}`);
    }
  }

  public async saveTraceViewer(
    browsers: Browser[],
    testFailedKebabCaseName: string,
    destinationTracesDirectoryPath: string,
  ): Promise<void> {
    const containerId = this.getId();
    const tracesPathsByBrowserAndTestFailedTitle = this.getTracesPathsByBrowserAndTestFailedTitle(
      browsers,
      testFailedKebabCaseName,
    );

    this.createDirectoryIfNotExists(destinationTracesDirectoryPath);

    for (let t = 0; t < tracesPathsByBrowserAndTestFailedTitle.length; t++) {
      const tracePath = tracesPathsByBrowserAndTestFailedTitle[t];
      const browser = browsers[t];

      log.debug(`Extracting archive from container ${containerId} path ${tracePath} from container ...`);
      const archiveStream = await this.copyArchiveFromContainer(tracePath);
      log.debug(`Extracted archive from container ${containerId} path ${tracePath} from container`);

      log.debug(`Unpacking archive from container ${containerId} path ${tracePath}...`);
      const destinationDir = tmp.dirSync({ keep: false });
      await this.extractTarStreamToDestination(archiveStream, destinationDir.name);
      log.debug(`Unpacked archive from container ${containerId} path ${tracePath}`);

      const sourceTracePath = path.resolve(destinationDir.name, DEFAULT_TRACE_VIEWER_FILE);

      const destinationTraceDirectoryPath = path.resolve(
        destinationTracesDirectoryPath,
        `${testFailedKebabCaseName}-${browser}`,
      );

      const destinationTracePath = path.resolve(destinationTraceDirectoryPath, DEFAULT_TRACE_VIEWER_FILE);

      await this.removeFileIfExists(destinationTracePath);
      this.createDirectoryIfNotExists(destinationTraceDirectoryPath);

      log.debug(`Copying trace to "${destinationTracePath}..."`);
      await copyFile(sourceTracePath, destinationTracePath, 1);
      log.debug(`Copy trace to "${destinationTracePath}"`);
    }
  }

  override async stop(options?: Partial<StopOptions>): Promise<StoppedPlaywrightContainer> {
    return new StoppedPlaywrightContainer(await super.stop(options));
  }
}

export class StoppedPlaywrightContainer extends AbstractStoppedContainer {
  constructor(stoppedPlaywrightContainer: StoppedTestContainer) {
    super(stoppedPlaywrightContainer);
  }
}
