import * as fs from "fs";
import { Browser, chromium, Page } from "playwright";
import { test, suite, before, after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import {
  formatVelocity,
  prepareScreenshotFolder,
  readTestcaseFile,
  shouldRunScreenshotTests,
  isAllowedFileExtension,
} from "./testUtils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VALID_VELOCITY_PATH = resolve(__dirname, "parser/valid_velocity");

let browser: Browser | undefined;
let page: Page | undefined;

const runScreenshots = shouldRunScreenshotTests();

suite("prettier-velocity", () => {
  /* Browser lifecycle: only created when screenshot tests are enabled. */
  if (runScreenshots) {
    before(async () => {
      prepareScreenshotFolder();
      browser = await chromium.launch({ headless: true });
      page = await browser.newPage();
    });

    after(async () => {
      if (browser) await browser.close();
    });
  }

  for (const testCaseName of fs.readdirSync(VALID_VELOCITY_PATH)) {
    const testCasePath = resolve(VALID_VELOCITY_PATH, testCaseName);
    if (fs.lstatSync(testCasePath).isDirectory()) continue;
    if (!isAllowedFileExtension(testCaseName)) continue;

    /* Check textual equality: always runs. */
    test(`should format ${testCaseName} (textual)`, async () => {
      const [template, expectedOutput, options] =
        readTestcaseFile(testCasePath);
      const formattedTemplate = await formatVelocity(template, options);
      assert.strictEqual(formattedTemplate, expectedOutput);
    });

    /* Visual regression: only runs when screenshots are enabled. */
    if (runScreenshots && false) {
      test.skip(`should format ${testCaseName} (visual)`, async () => {
        // TO DO: pass to the Velocity server
      });
    }
  }
});
