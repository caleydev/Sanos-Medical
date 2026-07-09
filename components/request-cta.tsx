"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { FUNNEL_FORM_ANCHORS } from "@/lib/site";

/**
 * Context-aware "Request an appointment" CTA. On an appointment-funnel route
 * (where the PHI-safe form is already on the page) it scrolls to that page's
 * form instead of navigating to the primary-care funnel — this fixes the bug
 * where the prominent global CTAs dropped recovery-regen visitors onto the
 * wrong form and misrouted the lead. Everywhere else it links to /get-started.
 */
export function RequestCta({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const anchor = FUNNEL_FORM_ANCHORS[pathname];

  if (anchor) {
    return (
      <a href={anchor} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href="/get-started" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
