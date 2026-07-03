import { cn } from "@/lib/cn";

type Props = {
  titre: string;
  sousTitre?: string;
  align?: "left" | "center";
  /**
   * Filet d'accent au-dessus du titre. Suit --accent : dans un sous-arbre
   * .accent-forest il devient vert, sinon terracotta — c'est le support de
   * l'alternance des accents MLR. Off par défaut (CVM/mère inchangés).
   */
  accent?: boolean;
};

export function SectionHeading({
  titre,
  sousTitre,
  align = "left",
  accent = false,
}: Props) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {accent && (
        <span
          aria-hidden
          className={cn(
            "mb-3 block h-1 w-10 rounded-full bg-accent",
            align === "center" && "mx-auto",
          )}
        />
      )}
      <h2 className="font-heading text-3xl font-bold text-ink-strong sm:text-4xl">
        {titre}
      </h2>
      {sousTitre && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-ink-soft",
            align === "center" && "mx-auto",
          )}
        >
          {sousTitre}
        </p>
      )}
    </div>
  );
}
