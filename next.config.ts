import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at ./i18n/request.ts (no src/ directory in this project).
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Self-hosted on EC2 via Docker: emit a minimal standalone server bundle
  // (.next/standalone/server.js) so the runtime image stays small.
  output: "standalone",
};

export default withNextIntl(nextConfig);
