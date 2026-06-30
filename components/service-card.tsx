import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Linked card for a single service. Used by the home "pillars" grid and the
 * Services overview page. Copy is passed in from translated messages so no
 * strings are hard-coded here (SPEC §10).
 */
export function ServiceCard({
  icon: Icon,
  title,
  summary,
  href,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  summary: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group border-border bg-background rounded-card hover:border-secondary flex flex-col border p-6 transition hover:shadow-sm"
    >
      <Icon aria-hidden className="text-secondary h-8 w-8" />
      <h3 className="text-primary mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">{summary}</p>
      <span className="text-secondary mt-4 inline-flex items-center gap-1 text-sm font-semibold">
        {cta}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
