import { Languages, User } from "lucide-react";

/**
 * Provider profile card (SPEC §3). Data is passed in from translated, clearly
 * labeled placeholder messages — no unverified specialist or board-certification
 * claims (SPEC §6). TODO: swap the icon for a real headshot with alt text.
 */
export function ProviderCard({
  name,
  credentials,
  bio,
  languages,
  languagesLabel,
}: {
  name: string;
  credentials: string;
  bio: string;
  languages: string;
  languagesLabel: string;
}) {
  return (
    <article className="lift-card border-border bg-background flex h-full flex-col rounded-2xl border p-6">
      <span className="bg-surface text-secondary flex h-16 w-16 items-center justify-center rounded-full">
        <User aria-hidden className="text-secondary h-8 w-8" />
      </span>
      <h3 className="text-primary mt-4 text-lg font-semibold">{name}</h3>
      <p className="text-secondary text-sm font-medium">{credentials}</p>
      <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">{bio}</p>
      <p className="border-border text-ink mt-5 flex items-center gap-2 border-t pt-4 text-sm">
        <Languages aria-hidden className="text-secondary h-4 w-4 shrink-0" />
        <span className="font-medium">{languagesLabel}:</span> {languages}
      </p>
    </article>
  );
}
