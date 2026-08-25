import type { NextConfig } from "next";
import path from "node:path";

const configuredDistDir = process.env.POLYMERS_NEXT_DIST_DIR?.trim();
const configuredTsconfigPath = process.env.POLYMERS_NEXT_TSCONFIG_PATH?.trim();

function isolatedDistDir(): string | undefined {
  if (!configuredDistDir) return undefined;

  const segments = configuredDistDir.split(/[\\/]+/);
  if (
    path.isAbsolute(configuredDistDir) ||
    path.win32.isAbsolute(configuredDistDir) ||
    segments.some((segment) => segment === "..")
  ) {
    throw new Error(
      "POLYMERS_NEXT_DIST_DIR must stay inside polymer-v3 (absolute and parent-relative paths are not allowed).",
    );
  }

  return configuredDistDir;
}

const distDir = isolatedDistDir();

function isolatedTsconfigPath(): string | undefined {
  if (!configuredTsconfigPath) return undefined;

  if (
    path.dirname(configuredTsconfigPath) !== "." ||
    path.win32.dirname(configuredTsconfigPath) !== "." ||
    !/^tsconfig\.playwright-[a-zA-Z0-9_-]+\.json$/.test(configuredTsconfigPath)
  ) {
    throw new Error(
      "POLYMERS_NEXT_TSCONFIG_PATH must be a run-owned tsconfig.playwright-<id>.json file in polymer-v3.",
    );
  }

  return configuredTsconfigPath;
}

const tsconfigPath = isolatedTsconfigPath();

const nextConfig: NextConfig = {
  // Normal development and production builds keep Next's default `.next`.
  // Playwright opts into a per-invocation directory so its dev server can
  // never read or mutate the cache owned by a developer's live server.
  ...(distDir ? { distDir } : {}),
  // Next updates the selected tsconfig with generated type includes. Isolated
  // servers use a run-owned config so the tracked root tsconfig stays immutable.
  ...(tsconfigPath ? { typescript: { tsconfigPath } } : {}),
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.knowde.com",
        pathname: "/**",
      },
      {
        // Allow any HTTPS hostname for user-uploaded supplier/product logos
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
