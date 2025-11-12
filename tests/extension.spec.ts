import { test, expect, chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.resolve(__dirname, "..", "dist");

test("content script highlights saved links on example.com", async () => {
  const userDataDir = path.join(process.cwd(), "tmp-user-data");

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`,
    ],
  });

  const page = await context.newPage();
  await page.goto("https://example.com");

  const hasStyled = await page.evaluate(() => {
    const a = document.querySelector("a[href]");
    if (!a) return false;
    const bg = getComputedStyle(a).backgroundColor;
    const border = getComputedStyle(a).borderStyle;
    return Boolean(bg || border);
  });

  expect(hasStyled).toBe(true);

  await context.close();
});
