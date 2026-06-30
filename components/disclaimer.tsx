import { Info } from "lucide-react";

/**
 * COMPLIANCE (SPEC §6): the standard informational/medical-disclaimer callout.
 * Surfaced on every service page (and reusable elsewhere) so the site never
 * presents content as medical advice. Pass the localized disclaimer string as
 * children; never hard-code copy here (SPEC §10).
 */
export function Disclaimer({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <aside
      role="note"
      className={`border-border bg-surface rounded-card flex gap-3 border p-4 ${className}`}
    >
      <Info aria-hidden className="text-secondary mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-muted text-sm leading-relaxed">
        {title ? <p className="text-ink font-semibold">{title}</p> : null}
        {children}
      </div>
    </aside>
  );
}
