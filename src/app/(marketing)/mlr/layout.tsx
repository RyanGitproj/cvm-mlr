import { SiteShell } from "@/components/layout/SiteShell";
import { NAV_DEUX_UNIVERS } from "@/config/brands";

export default function MlrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mlr"
      className="texture-paper"
      homeHref="/mlr"
      homeLabel="Liberty Roots"
      links={NAV_DEUX_UNIVERS}
      cta={{ href: "/mlr#questionnaire", label: "Choisir mon aventure" }}
    >
      {children}
    </SiteShell>
  );
}
