import { SiteShell } from "@/components/layout/SiteShell";
import { NAV_DEUX_UNIVERS } from "@/config/brands";

export default function CvmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="cvm"
      homeHref="/cvm"
      homeLabel="Célébrations Voyages"
      links={NAV_DEUX_UNIVERS}
      cta={{ href: "/cvm/orientation/questionnaire", label: "Être conseillé" }}
    >
      {children}
    </SiteShell>
  );
}
