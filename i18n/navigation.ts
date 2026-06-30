import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers. Use these instead of next/link and
// next/navigation so locale prefixes are handled automatically and the
// language toggle can preserve the current path.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
