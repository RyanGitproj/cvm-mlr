import { SiteShell } from "@/components/layout/SiteShell";

export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Navbar réduite au logo (directive Ryan 2026-07-09). Pour réafficher les
  // deux univers, repasser `links={navFor("mere")}` (import de @/config/brands).
  return (
    <SiteShell
      theme="mere"
      homeLabel="Madagascar"
      links={[]}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">{children}</div>
    </SiteShell>
  );
}
