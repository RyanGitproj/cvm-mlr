import { FunnelShell } from "@/components/layout/FunnelShell";
import { VisitorGate } from "@/components/marketing/VisitorGate";

export default function CvmFunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <VisitorGate>
      <FunnelShell
        theme="cvm"
        backHref="/cvm"
        backLabel="Célébrations Voyages Madagascar"
        tagline="Là où les autres ne vont pas"
      >
        {children}
      </FunnelShell>
    </VisitorGate>
  );
}
