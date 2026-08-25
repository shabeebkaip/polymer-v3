import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

function parsePort(rawPort: string): number {
  if (!/^\d+$/.test(rawPort)) {
    throw new Error(`Invalid Playwright port "${rawPort}": expected an integer from 1024 to 65535.`);
  }

  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1024 || port > 65_535) {
    throw new Error(`Invalid Playwright port "${rawPort}": expected an integer from 1024 to 65535.`);
  }

  return port;
}

const webPort = parsePort(
  process.env.POLYMERS_E2E_PORT?.trim() || process.env.PLAYWRIGHT_PORT?.trim() || "3100",
);
const webUrl = `http://127.0.0.1:${webPort}`;
const inheritedRunId = process.env.POLYMERS_E2E_RUN_ID?.trim();
if (inheritedRunId && !/^[a-z0-9]+-\d+$/.test(inheritedRunId)) {
  throw new Error("Invalid inherited POLYMERS_E2E_RUN_ID.");
}

const ownsRun = !inheritedRunId;
const runId = inheritedRunId || `${Date.now().toString(36)}-${process.pid}`;
const nextDistDir = `playwright/.cache/next-${webPort}-${runId}`;
const nextTsconfigPath = `tsconfig.playwright-${webPort}-${runId}.json`;

if (ownsRun) {
  fs.writeFileSync(
    path.resolve(__dirname, nextTsconfigPath),
    `${JSON.stringify({ extends: "./tsconfig.json" }, null, 2)}\n`,
    { encoding: "utf8", flag: "wx" },
  );
}

// Test workers inherit this value from the Playwright coordinator. Cleanup
// uses it together with TEST_WORKER_INDEX to isolate products created by
// fully-parallel workers on the shared seller account.
process.env.POLYMERS_E2E_RUN_ID = runId;
process.env.POLYMERS_E2E_NEXT_DIST_DIR = nextDistDir;
process.env.POLYMERS_E2E_NEXT_TSCONFIG_PATH = nextTsconfigPath;
process.env.POLYMERS_E2E_RESOLVED_PORT = String(webPort);

export default defineConfig({
  testDir: "./e2e",
  outputDir: `test-results/${runId}`,
  fullyParallel: true,
  retries: 0,
  reporter: [
    ["list"],
    ["./e2e/playwright-artifact-cleanup.ts"],
  ],
  use: {
    baseURL: webUrl,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm exec next dev --turbopack --hostname 127.0.0.1 --port ${webPort}`,
    env: {
      ...Object.fromEntries(
        Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined),
      ),
      POLYMERS_NEXT_DIST_DIR: nextDistDir,
      POLYMERS_NEXT_TSCONFIG_PATH: nextTsconfigPath,
      POLYMERS_E2E_RUN_ID: runId,
    },
    url: webUrl,
    // A Playwright invocation must own the server it tests. If the chosen
    // port is occupied, fail safely instead of attaching to a developer's
    // live server (whose lifecycle and cache Playwright does not own).
    reuseExistingServer: false,
    gracefulShutdown: { signal: "SIGTERM", timeout: 10_000 },
    timeout: 120_000,
  },
});
