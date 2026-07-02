"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

type NavLink = {
  href: string;
  label: string;
};

export function MobileNav({
  links,
  ctaLabel,
  openLabel,
  closeLabel,
}: {
  links: NavLink[];
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={isOpen ? closeLabel : openLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((value) => !value)}
        className="border-border text-primary bg-background hover:bg-surface inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition"
      >
        {isOpen ? (
          <X aria-hidden className="h-5 w-5" />
        ) : (
          <Menu aria-hidden className="h-5 w-5" />
        )}
      </button>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="border-border bg-background absolute inset-x-4 top-20 z-50 rounded-2xl border p-4 shadow-xl"
        >
          <nav aria-label={openLabel}>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-ink hover:bg-surface block rounded-xl px-4 py-3 text-sm font-semibold transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="bg-secondary text-secondary-foreground mt-4 block rounded-full px-5 py-3 text-center text-sm font-semibold transition hover:opacity-95"
          >
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
