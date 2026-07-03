import { FunnelShell } from "@/components/layout/FunnelShell";

export default function MlrFunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <FunnelShell
      theme="mlr"
      backHref="/mlr"
      backLabel="Madagascar Liberty Routes"
      tagline="Voyagez autrement, vivez vrai"
    >
      {children}
    </FunnelShell>
  );
}
