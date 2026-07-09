import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BaselineBand } from "./BaselineBand";
import { Footer } from "./Footer";
import { Header, type NavLink } from "./Header";

type Props = {
  theme: "mere" | "cvm" | "mlr";
  homeLabel: string;
  links: NavLink[];
  /** CTA d'action du funnel dans le header (absent sur la page mère). */
  cta?: NavLink;
  /** Élément d'action libre dans le header (ex. bouton CVM par aventure). */
  action?: ReactNode;
  /** Classe additionnelle du wrapper (ex. texture-paper pour MLR). */
  className?: string;
  children: ReactNode;
};

/**
 * Coquille de page marketing : applique le thème du route group
 * (data-theme) et pose header + footer aux couleurs de l'univers.
 */
export function SiteShell({
  theme,
  homeLabel,
  links,
  cta,
  action,
  className,
  children,
}: Props) {
  return (
    <div
      data-theme={theme}
      className={cn(
        "flex min-h-screen flex-col bg-surface font-body text-ink",
        className,
      )}
    >
      <Header homeLabel={homeLabel} links={links} cta={cta} action={action} />
      {theme === "mlr" && <BaselineBand />}
      <main className="flex-1">{children}</main>
      <Footer brand={theme} />
    </div>
  );
}
