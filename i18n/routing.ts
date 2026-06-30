import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales. English is the default; Spanish is a first-class peer
  // for the Miami audience (see SPEC §2, §4).
  locales: ["en", "es"],
  defaultLocale: "en",
  // Always prefix the locale in the URL (/en/..., /es/...). The root "/" is
  // redirected to a detected locale by proxy.ts.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
