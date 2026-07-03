import { SiteShell } from "@/components/layout/SiteShell";

export default function MlrLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell
      theme="mlr"
      className="texture-paper"
      homeHref="/mlr"
      homeLabel="Liberty Routes"
      links={[
        { href: "/mlr/nord", label: "Nord" },
        { href: "/mlr/sud", label: "Sud" },
        { href: "/mlr/est", label: "Est" },
        { href: "/mlr/ouest", label: "Ouest" },
      ]}
    >
      {children}
    </SiteShell>
  );
}
