import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// NOTE (Next.js 16): "Proxy" is the new name for what was previously called
// Middleware. next-intl still exports the handler from "next-intl/middleware".
// This handles locale detection and redirects "/" -> "/en" or "/es".
export default createMiddleware(routing);

export const config = {
  // Run on every path except Next internals, API routes, and files with an
  // extension (e.g. /logo.svg, /favicon.ico).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
