import { CvmHeaderCta } from "@/components/layout/CvmHeaderCta";
import { SiteShell } from "@/components/layout/SiteShell";

export default function CvmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Navbar réduite au logo (directive Ryan 2026-07-09) : plus de liens
  // d'univers ni de CTA « Parler à un conseiller ». Pour les réafficher,
  // repasser `links={navFor("cvm")}` (import `navFor` de @/config/brands) et
  // le bloc `cta` téléphone — le Header et le SiteShell les gèrent toujours.
  // Seule exception : sur les 4 pages d'aventure, `CvmHeaderCta` ajoute un
  // bouton scroll-to-form coloré par la charte de la page (null ailleurs).
  return (
    <SiteShell
      theme="cvm"
      homeLabel="Célébrations Voyages"
      links={[]}
      action={<CvmHeaderCta />}
    >
      {children}
    </SiteShell>
  );
}
