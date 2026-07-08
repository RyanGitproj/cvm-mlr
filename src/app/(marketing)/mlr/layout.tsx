import { SiteShell } from "@/components/layout/SiteShell";
import { NAV_DEUX_UNIVERS } from "@/config/brands";
import { contact } from "@/config/site";

export default function MlrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mlr"
      className="texture-paper"
      homeLabel="Liberty Roots"
      links={NAV_DEUX_UNIVERS}
      cta={
        contact.telephone
          ? { href: `tel:${contact.telephone}`, label: "Parler à un conseiller" }
          : undefined
      }
    >
      {children}
    </SiteShell>
  );
}
