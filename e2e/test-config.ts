import fs from "node:fs";
import path from "path";

export function requireE2ECredentials() {
  const email = process.env.POLYMERS_E2E_EMAIL?.trim();
  const password = process.env.POLYMERS_E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E login requires POLYMERS_E2E_EMAIL and POLYMERS_E2E_PASSWORD. Set both environment variables before running login-dependent Playwright tests.",
    );
  }

  return { email, password };
}

const projectRoot = path.resolve(__dirname, "..");
const fixtureRoot = path.resolve(
  projectRoot,
  process.env.POLYMERS_E2E_FIXTURE_DIR?.trim() ||
    "../polymer-ai-parser-poc/test-catalogs/files",
);

export function catalogFixture(fileName: string): string {
  const fixturePath = path.resolve(fixtureRoot, fileName);
  const relativePath = path.relative(fixtureRoot, fixturePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`E2E fixture must stay inside POLYMERS_E2E_FIXTURE_DIR: ${fileName}`);
  }
  if (!fs.existsSync(fixturePath)) {
    throw new Error(
      `E2E fixture not found: ${fixturePath}. Set POLYMERS_E2E_FIXTURE_DIR to the catalogue fixture directory.`,
    );
  }

  return fixturePath;
}
