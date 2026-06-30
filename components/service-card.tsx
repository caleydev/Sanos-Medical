import Image from "next/image";
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
  imageSrc,
  imageAlt,
}: {
  icon: LucideIcon;
  title: string;
  summary: string;
  href: string;
  cta: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <Link
      href={href}
      className="lift-card group border-border bg-background rounded-2xl flex flex-col border p-3"
    >
      <div className="bg-surface relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
        {imageSrc && imageAlt ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            {/* TODO: replace placeholder media with approved service photography. */}
            <div className="absolute -top-12 -right-10 h-28 w-28 rounded-full bg-white/70" />
            <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-secondary/10" />
            <span className="bg-background text-secondary relative inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm">
              <Icon aria-hidden className="h-8 w-8" />
            </span>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-primary text-lg font-semibold leading-snug">{title}</h3>
        <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
          {summary}
        </p>
        <span className="text-secondary mt-5 inline-flex items-center gap-1 text-sm font-semibold">
          {cta}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
