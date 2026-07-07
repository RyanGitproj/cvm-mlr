import Image from "next/image";
import { cn } from "@/lib/cn";

type Ratio = "16/9" | "4/3" | "3/4";

type Props = {
  /** Chemin de l'asset réel (`public/images/...`). */
  src: string;
  /** Alt descriptif définitif — accessibilité + SEO. */
  alt: string;
  ratio: Ratio;
  /** Largeurs d'affichage responsive transmises à next/image. */
  sizes: string;
  className?: string;
};

/**
 * Photo de contenu dans le même cadre que PlaceholderImage (ratio réservé,
 * coins et bordure identiques) : le remplacement d'un placeholder par la
 * vraie photo ne provoque aucun layout shift.
 */
export function ContentImage({ src, alt, ratio, sizes, className }: Props) {
  return (
    <div
      style={{ aspectRatio: ratio.replace("/", " / ") }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border-2 border-line",
        className,
      )}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
