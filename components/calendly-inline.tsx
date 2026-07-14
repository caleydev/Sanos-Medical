"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TriangleAlert } from "lucide-react";
import { CLINIC } from "@/lib/site";

// Calendly injects a global `window.Calendly` once widget.js loads. We call one
// method, so we declare just that shape — enough for strict TS without an
// ambient @types package.
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

/**
 * Inline Calendly scheduler (SPEC §5 scheduling path). Pure client-side embed:
 * Calendly renders its booking UI in an iframe inside `parentElement` — no API
 * key, no server round-trip. A confirmed booking is later mirrored into our lead
 * pipeline via the Calendly webhook route (Layer 2, added separately).
 *
 * COMPLIANCE: the linked Calendly event must collect scheduling logistics ONLY
 * (name, email, phone, non-medical reason). No symptom/medical questions —
 * standard Calendly is not HIPAA-eligible without an Enterprise BAA.
 */
export function CalendlyInline() {
  const t = useTranslations("contact.scheduler");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  // Lazy gate: don't fetch widget.js (which sets Calendly's third-party cookies)
  // until the widget scrolls near the viewport. Perf + keeps those cookies off
  // the initial load. NOTE: a site-wide cookie-consent gate is still a TODO
  // (SPEC §6); this defers, it does not replace, that consent story.
  const [inView, setInView] = useState(false);

  const url = CLINIC.calendlyUrl;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView || !url) return;
    const el = containerRef.current;
    if (!el) return;

    // Localize Calendly's own iframe UI. We leave `hide_gdpr_banner` OFF so
    // Calendly shows its own cookie notice for its own cookies.
    const embedUrl = new URL(url);
    embedUrl.searchParams.set("locale", locale);

    function render() {
      if (!window.Calendly || !el) return;
      el.replaceChildren(); // guard against React StrictMode's double-invoke
      window.Calendly.initInlineWidget({
        url: embedUrl.toString(),
        parentElement: el,
      });
    }

    // Load widget.js once per page, then (re)render into our container.
    if (window.Calendly) {
      render();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", render, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.addEventListener("load", render, { once: true });
    document.head.appendChild(script);
  }, [inView, url, locale]);

  // Not provisioned yet (e.g. local dev, or env unset): mirror how our other
  // integrations no-op rather than erroring.
  if (!url) {
    return (
      <div className="border-border bg-surface text-muted rounded-2xl border border-dashed p-6 text-sm">
        <TriangleAlert aria-hidden className="mb-2 h-5 w-5" />
        {t("unavailable")}
      </div>
    );
  }

  return (
    <>
      {/* Calendly injects its iframe here. A fixed height avoids layout shift
          while the widget boots and gives the iframe a box to fill. */}
      <div
        ref={containerRef}
        className="min-w-[320px] h-[700px] w-full"
        aria-label={t("heading")}
      />
      {/* Progressive-enhancement fallback: if the script is blocked or JS is
          off, users can still reach the scheduler directly. */}
      <noscript>
        <a href={url} className="text-cta font-medium hover:underline">
          {t("fallbackLink")}
        </a>
      </noscript>
    </>
  );
}
