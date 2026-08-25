import fs from "node:fs/promises";
import path from "node:path";
import type { Reporter } from "@playwright/test/reporter";

const projectRoot = path.resolve(__dirname, "..");
const cacheRoot = path.resolve(projectRoot, "playwright/.cache");

class PlaywrightArtifactCleanupReporter implements Reporter {
  printsToStdio(): boolean {
    return false;
  }

  async onExit(): Promise<void> {
    const runId = process.env.POLYMERS_E2E_RUN_ID;
    const port = process.env.POLYMERS_E2E_RESOLVED_PORT;
    const configuredDistDir = process.env.POLYMERS_E2E_NEXT_DIST_DIR;
    const configuredTsconfigPath = process.env.POLYMERS_E2E_NEXT_TSCONFIG_PATH;
    const expectedDistDir = runId && port
      ? `playwright/.cache/next-${port}-${runId}`
      : undefined;
    const expectedTsconfigPath = runId && port
      ? `tsconfig.playwright-${port}-${runId}.json`
      : undefined;

    if (
      !expectedDistDir ||
      !expectedTsconfigPath ||
      configuredDistDir !== expectedDistDir ||
      configuredTsconfigPath !== expectedTsconfigPath
    ) {
      console.error(
        "[e2e cleanup] Refusing to remove Next artifacts: run-owned identity is missing or inconsistent.",
      );
      return;
    }

    const distTarget = path.resolve(projectRoot, configuredDistDir);
    const tsconfigTarget = path.resolve(projectRoot, configuredTsconfigPath);
    if (
      path.dirname(distTarget) !== cacheRoot ||
      path.basename(distTarget) !== `next-${port}-${runId}` ||
      path.dirname(tsconfigTarget) !== projectRoot ||
      path.basename(tsconfigTarget) !== expectedTsconfigPath
    ) {
      console.error(
        "[e2e cleanup] Refusing to remove Next artifacts outside their run-owned locations.",
      );
      return;
    }

    for (const target of [distTarget, tsconfigTarget]) {
      try {
        await fs.rm(target, {
          recursive: true,
          force: true,
          maxRetries: 3,
          retryDelay: 100,
        });
      } catch (error) {
        console.error(`[e2e cleanup] Failed to remove run-owned Next artifact at ${target}:`, error);
      }
    }
  }
}

export default PlaywrightArtifactCleanupReporter;
