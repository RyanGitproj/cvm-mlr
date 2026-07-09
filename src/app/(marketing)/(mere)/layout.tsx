import { SiteShell } from "@/components/layout/SiteShell";

export default function MereLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Navbar réduite au logo (directive Ryan 2026-07-09). Pour réafficher les
  // deux univers, repasser `links={navFor("mere")}` (import de @/config/brands).
  return (
    <SiteShell theme="mere" homeLabel="Madagascar" links={[]}>
      {children}
    </SiteShell>
  );
}
