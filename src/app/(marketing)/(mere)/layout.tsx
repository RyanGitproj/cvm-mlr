import { SiteShell } from "@/components/layout/SiteShell";
import { NAV_DEUX_UNIVERS } from "@/config/brands";

export default function MereLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mere"
      homeHref="/"
      homeLabel="Madagascar"
      links={NAV_DEUX_UNIVERS}
    >
      {children}
    </SiteShell>
  );
}
