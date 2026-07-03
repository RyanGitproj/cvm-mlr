import { SiteShell } from "@/components/layout/SiteShell";

export default function LegalLayout({
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
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">{children}</div>
    </SiteShell>
  );
}
