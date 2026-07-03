import { FunnelShell } from "@/components/layout/FunnelShell";

export default function CvmFunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <FunnelShell
      theme="cvm"
      backHref="/cvm"
      backLabel="Célébration Voyage Madagascar"
      tagline="Là où les autres ne vont pas"
    >
      {children}
    </FunnelShell>
  );
}
