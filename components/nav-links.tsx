"use client";

import { Link, usePathname } from "@/i18n/navigation";

type NavLink = { href: string; label: string };

/**
 * Desktop nav with an active-page indicator (dot + color), mirroring the
 * modern-clinical design direction. Client component: needs the current
 * pathname. Labels are translated by the server parent — no strings here.
 */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative text-sm font-medium transition ${
              isActive
                ? "text-cta"
                : "text-ink hover:text-cta"
            }`}
          >
            {link.label}
            {isActive ? (
              <span
                aria-hidden
                className="bg-secondary absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
              />
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
