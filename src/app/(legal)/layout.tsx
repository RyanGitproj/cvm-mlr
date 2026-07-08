import { SiteShell } from "@/components/layout/SiteShell";
import { NAV_DEUX_UNIVERS } from "@/config/brands";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mere"
      homeLabel="Madagascar"
      links={NAV_DEUX_UNIVERS}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">{children}</div>
    </SiteShell>
  );
}
