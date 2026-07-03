import { cn } from "@/lib/cn";

type Props = {
  titre: string;
  sousTitre?: string;
  align?: "left" | "center";
};

export function SectionHeading({ titre, sousTitre, align = "left" }: Props) {
  return (
    <div className={cn(align === "center" && "text-center")}>
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
