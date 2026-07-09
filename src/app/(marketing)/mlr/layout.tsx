import { SiteShell } from "@/components/layout/SiteShell";

export default function MlrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Navbar réduite au logo (directive Ryan 2026-07-09) : plus de liens
  // d'univers ni de CTA « Parler à un conseiller ». Pour les réafficher,
  // repasser `links={navFor("mlr")}` (import `navFor` de @/config/brands) et
  // le bloc `cta` téléphone — le Header et le SiteShell les gèrent toujours.
  return (
    <SiteShell
      theme="mlr"
      className="texture-paper"
      homeLabel="Liberty Roots"
      links={[]}
    >
      {children}
    </SiteShell>
  );
}
