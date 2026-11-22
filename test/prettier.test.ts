import * as fs from "fs";
import { Browser, chromium, Page } from "playwright";
import { test, suite, before, after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import {
  takeScreenshot,
  compareScreenshots,
  formatHtml,
  formatVelocity,
  readTestcaseFile,
  prepareScreenshotFolder,
  shouldRunScreenshotTests,
  isAllowedFileExtension,
} from "./testUtils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let browser: Browser | undefined;
let page: Page | undefined;

const runScreenshots = shouldRunScreenshotTests();

suite("prettier", () => {
  /* Browser lifecycle: only created when screenshot tests are enabled. */
  if (runScreenshots) {
    before(async () => {
      prepareScreenshotFolder();
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { height: 2000, width: 1000 },
      });
      page = await context.newPage();
    });

    after(async () => {
      if (browser) await browser.close();
    });
  }

  /* Negative visual test: only runs when screenshots are enabled. */
  (runScreenshots ? test : test.skip)(
    "should have pixel mismatch",
    async () => {
      const testCaseName = "negative_pixel_test";
      const mismatch = compareScreenshots(
        await takeScreenshot!(
          page!,
          `${testCaseName}_velocity`,
          "<p>foo<span>bar</span></p>",
        ),
        await takeScreenshot!(
          page!,
          `${testCaseName}_prettier`,
          "<p>foo <span>bar</span></p>",
        ),
        `${testCaseName}_diff`,
      );
      assert.notEqual(mismatch, 0);
    },
  );

  /* Invalid HTML: always runs (pure formatter check). */
  for (const testCaseName of fs.readdirSync(
    resolve(__dirname, "parser/invalid_html"),
  )) {
    test(`should not process ${testCaseName}`, async () => {
      const [input, expectedOutput, options] = readTestcaseFile(
        resolve(__dirname, "parser/invalid_html", testCaseName),
      );

      let threw = false;
      try {
        await formatVelocity(input, options);
      } catch (e: unknown) {
        threw = true;
        if (e instanceof Error) {
          const clean = e.message.replace(/\u001b\[.*?m/g, "");
          assert.strictEqual(clean, expectedOutput);
        } else {
          throw new Error(`Unknown error type ${typeof e}`);
        }
      }
      assert.ok(threw, "expected formatter to throw");
    });
  }

  /* Valid HTML: textual assertion always runs, screenshots run only when enabled. */
  for (const testCaseName of fs.readdirSync(
    resolve(__dirname, "parser/valid_html"),
  )) {
    if (!isAllowedFileExtension(testCaseName)) continue;

    /* Check textual equality: always runs. */
    test(`should format ${testCaseName} (textual)`, async () => {
      const [input, expectedOutput, options] = readTestcaseFile(
        resolve(__dirname, "parser/valid_html", testCaseName),
      );

      const formatted = await formatVelocity(input, options);
      assert.strictEqual(formatted, expectedOutput);
    });

    /* Check pixel parity with vanilla Prettier: only runs when screenshots are enabled. */
    (runScreenshots ? test : test.skip)(
      `should format ${testCaseName} (visual)`,
      async () => {
        const [input, expectedOutput, options] = readTestcaseFile(
          resolve(__dirname, "parser/valid_html", testCaseName),
        );

        const formatted = await formatVelocity(input, options);
        const prettierFormatted = await formatHtml(input);

        const mismatchedPixels = compareScreenshots(
          await takeScreenshot!(page!, `${testCaseName}_velocity`, formatted),
          await takeScreenshot!(
            page!,
            `${testCaseName}_prettier`,
            prettierFormatted,
          ),
          `${testCaseName}_diff`,
        );

        assert.strictEqual(
          formatted,
          expectedOutput,
          `Expected does not match actual. Rendered output is equal to prettier? ${
            mismatchedPixels === 0
          }`,
        );
        assert.strictEqual(mismatchedPixels, 0);
      },
    );
  }
});
