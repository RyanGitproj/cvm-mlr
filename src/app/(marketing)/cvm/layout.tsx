import { SiteShell } from "@/components/layout/SiteShell";

export default function CvmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="cvm"
      homeHref="/cvm"
      homeLabel="Célébration Voyage"
      links={[
        { href: "/cvm/explorer", label: "Expédition" },
        { href: "/cvm/treks", label: "Trek Aventure" },
        { href: "/cvm/iles", label: "Séjour Collection" },
        { href: "/cvm/un-mois", label: "Grand Tour" },
      ]}
    >
      {children}
    </SiteShell>
  );
}
