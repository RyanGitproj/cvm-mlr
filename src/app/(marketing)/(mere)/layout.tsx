import { SiteShell } from "@/components/layout/SiteShell";

export default function MereLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mere"
      homeHref="/"
      homeLabel="Madagascar"
      links={[
        // Deux clics possibles, pas plus (directive boss 2026-07) : la FAQ
        // reste accessible via le footer, hors du parcours principal.
        { href: "/cvm", label: "Célébration Voyage" },
        { href: "/mlr", label: "Liberty Roots" },
      ]}
    >
      {children}
    </SiteShell>
  );
}
