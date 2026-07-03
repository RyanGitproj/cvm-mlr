import { SiteShell } from "@/components/layout/SiteShell";

export default function MereLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mere"
      homeHref="/"
      homeLabel="Madagascar"
      links={[
        { href: "/cvm", label: "Célébration Voyage" },
        { href: "/mlr", label: "Liberty Roots" },
        { href: "/faq", label: "FAQ" },
      ]}
    >
      {children}
    </SiteShell>
  );
}
