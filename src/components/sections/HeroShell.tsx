import { HeroBackground } from "./HeroBackground";

type Props = {
  /** Décrit l'image attendue — guide le remplacement par le vrai asset. */
  label: string;
  /** Alt définitif de l'image de fond (accessibilité + futur SEO). */
  alt: string;
  /** Chemin de l'asset réel (`public/images/...`) — absent tant que non fourni. */
  src?: string;
  children: React.ReactNode;
};

/**
 * Cadre commun des couvertures — source unique de leur hauteur (décision Ryan
 * 2026-07-09) : ~80 % de l'écran en PC, ~70 % en mobile (un écran portrait
 * quasi plein recadrerait trop les visuels paysage et masquerait la suite —
 * retour Ryan même jour), pour que le début de la section suivante dépasse
 * en bas et invite au scroll. `min-h` (jamais `h`) : un contenu plus haut que
 * le cadre l'étire au lieu d'être coupé ; le padding vertical sert de garde-fou.
 */
export function HeroShell({ label, alt, src, children }: Props) {
  return (
    <section className="relative flex min-h-[70svh] flex-col overflow-hidden md:min-h-[80svh]">
      <HeroBackground label={label} alt={alt} src={src} />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-14 sm:px-6 sm:py-16">
        {children}
      </div>
    </section>
  );
}
