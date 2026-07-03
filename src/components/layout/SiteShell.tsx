import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Footer } from "./Footer";
import { Header, type NavLink } from "./Header";

type Props = {
  theme: "mere" | "cvm" | "mlr";
  homeHref: string;
  homeLabel: string;
  links: NavLink[];
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
  homeHref,
  homeLabel,
  links,
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
      <Header homeHref={homeHref} homeLabel={homeLabel} links={links} />
      <main className="flex-1">{children}</main>
      <Footer brand={theme} />
    </div>
  );
}
