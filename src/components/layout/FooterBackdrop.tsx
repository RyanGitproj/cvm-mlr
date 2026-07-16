"use client";

import { usePathname } from "next/navigation";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { footerImageFor } from "@/config/footer";

/**
 * Fond image plein cadre du footer, choisi par page via `pathname` (le footer
 * est rendu par le layout de groupe, pas par la page — d'où le choix côté
 * client, comme `CvmHeaderCta`). Le voile sombre par-dessus porte la lisibilité
 * du texte clair et masque le léger adoucissement de la bannière étirée sur un
 * footer mobile haut (décision Ryan « voile sombre appuyé ») : plus dense
 * sous `sm`.
 */
export function FooterBackdrop() {
  const pathname = usePathname();
  const image = footerImageFor(pathname);
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <MediaBackdrop image={image} sizes="100vw" showLabel={false} />
      <div className="absolute inset-0 bg-ink-strong/65 sm:bg-ink-strong/45" />
    </div>
  );
}
