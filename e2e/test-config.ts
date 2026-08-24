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

export const catalogFixture = (fileName: string) =>
  path.resolve(__dirname, "../../polymer-ai-parser-poc/test-catalogs/files", fileName);
