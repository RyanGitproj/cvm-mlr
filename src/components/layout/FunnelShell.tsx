import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  theme: "mere" | "cvm" | "mlr";
  backHref: string;
  backLabel: string;
  /** Baseline de marque affichée sous le header (« ◆ … ◆ »). */
  tagline?: string;
  children: ReactNode;
};

/** Wrapper questionnaire : chrome minimal, focus sur le formulaire. */
export function FunnelShell({
  theme,
  backHref,
  backLabel,
  tagline,
  children,
}: Props) {
  return (
    <div
      data-theme={theme}
      className="flex min-h-screen flex-col bg-surface font-body text-ink"
    >
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center px-4">
          <Link
            href={backHref}
            className="text-sm font-medium text-ink-soft transition-colors hover:text-ink-strong"
          >
            ← {backLabel}
          </Link>
        </div>
        {tagline && (
          <p className="border-t border-line py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            ◆ {tagline} ◆
          </p>
        )}
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-line px-4 py-4 text-center text-xs text-ink-soft">
        <Link href="/mentions-legales" className="hover:text-ink-strong">
          Mentions légales
        </Link>
        {" · "}
        <Link href="/confidentialite" className="hover:text-ink-strong">
          Politique de confidentialité
        </Link>
      </footer>
    </div>
  );
}
