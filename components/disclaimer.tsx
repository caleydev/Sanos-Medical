import { Info, TriangleAlert } from "lucide-react";

const VARIANTS = {
  info: {
    icon: Info,
    container: "border-border bg-surface",
    iconColor: "text-secondary",
    body: "text-muted",
    titleColor: "text-ink",
  },
  warning: {
    icon: TriangleAlert,
    container: "border-warning/30 bg-warning-surface",
    iconColor: "text-warning",
    body: "text-warning",
    titleColor: "text-warning",
  },
} as const;

/**
 * COMPLIANCE (SPEC §6): the standard informational/medical-disclaimer callout.
 * Surfaced on every service page (and reusable elsewhere) so the site never
 * presents content as medical advice. Pass the localized disclaimer string as
 * children; never hard-code copy here (SPEC §10).
 *
 * `variant="warning"` renders the amber counsel/legal-review treatment (shared
 * with the legal pages so there is one callout implementation, not two).
 */
export function Disclaimer({
  children,
  title,
  variant = "info",
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  return (
    <aside
      role="note"
      className={`rounded-card flex gap-3 border p-4 ${v.container} ${className}`}
    >
      <Icon aria-hidden className={`mt-0.5 h-5 w-5 shrink-0 ${v.iconColor}`} />
      <div className={`text-sm leading-relaxed ${v.body}`}>
        {title ? (
          <p className={`font-semibold ${v.titleColor}`}>{title}</p>
        ) : null}
        {children}
      </div>
    </aside>
  );
}
