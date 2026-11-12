import { format, type Options as PrettierOptions } from "prettier";
import * as fs from "fs";
import * as process from "process";
import * as path from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { Page } from "playwright";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const SCREENSHOT_FOLDER = path.join(
  process.cwd(),
  "dist",
  "test",
  "screenshots"
);

export const prepareScreenshotFolder = (): void => {
  if (!fs.existsSync(SCREENSHOT_FOLDER)) {
    fs.mkdirSync(SCREENSHOT_FOLDER, { recursive: true });
  }
};

export const sleep = async (timeInMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
};

const loadVelocityPlugin = async () => {
  const mod = await import(`${__dirname}/../dist/index.js`);
  return mod.default ?? mod;
};

export const formatHtml = async (input: string): Promise<string> => {
  return format(input, { parser: "html" });
};

export const formatVelocity = async (
  input: string,
  options: PrettierOptions | undefined
): Promise<string> => {
  const plugin = await loadVelocityPlugin();
  return format(input, {
    parser: "velocity-html",
    plugins: [plugin],
    ...options,
  });
};

export interface TestOptions extends PrettierOptions {
  compareScreenshots: boolean;
}

export const readTestcaseFile = (
  filePath: string
): [string, string, TestOptions] => {
  let content = fs.readFileSync(filePath, "utf8");
  const parts = content.split(
    "\n=====================================input======================================\n"
  );

  let testOptions: TestOptions = {
    printWidth: 80,
    compareScreenshots: true,
  };

  if (parts.length > 1) {
    testOptions = {
      ...testOptions,
      ...(JSON.parse(parts[0]) as TestOptions),
    };
    content = parts[1];
  }

  const [input, expectedOutput] = content.split(
    "\n=====================================output=====================================\n"
  );

  if (expectedOutput === undefined) {
    throw new Error(
      `File ${filePath} is not a valid testcase – missing output delimiter`
    );
  }

  return [input, expectedOutput, testOptions];
};

export const isAllowedFileExtension = (fileName: string): boolean => {
  const allowed = [".html", ".vm"] as const;
  return allowed.some((ext) => fileName.endsWith(ext));
};

export const compareScreenshots = (
  path1: string,
  path2: string,
  prefix: string
): number => {
  const png1 = PNG.sync.read(fs.readFileSync(path1));
  const png2 = PNG.sync.read(fs.readFileSync(path2));
  const { width, height } = png1;
  const diff = new PNG({ width, height });

  const mismatched = pixelmatch(
    png1.data,
    png2.data,
    diff.data,
    width,
    height,
    { threshold: 0 }
  );

  const diffPath = path.join(SCREENSHOT_FOLDER, `${prefix}.png`);
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return mismatched;
};

export const takeScreenshot = async (
  page: Page,
  prefix: string,
  html: string
): Promise<string> => {
  const htmlPath = path.join(SCREENSHOT_FOLDER, `${prefix}.html`);
  fs.writeFileSync(htmlPath, html);
  await page.goto(`file://${htmlPath}`);

  const tooLong = await page.evaluate(
    "Math.max(document.body.offsetHeight, document.body.clientHeight, document.body.scrollHeight) > window.innerHeight"
  );

  if (html.includes("<video")) await sleep(2000);

  const screenshotPath = path.join(SCREENSHOT_FOLDER, `${prefix}.png`);
  await page.screenshot({ path: screenshotPath });

  if (tooLong) {
    throw new Error(`Content of ${prefix} is too long for a single viewport.`);
  }
  return screenshotPath;
};

export const shouldRunScreenshotTests = (): boolean => {
  // Accept either an env‑var or a CLI flag.
  return (
    process.env.RUN_SCREENSHOT_TESTS === "1" ||
    process.argv.includes("--run-screenshot-tests")
  );
};
