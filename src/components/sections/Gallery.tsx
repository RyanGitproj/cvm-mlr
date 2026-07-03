import { Reveal } from "@/components/motion/Reveal";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "./SectionHeading";

type Item = { label: string; alt: string };

type Props = {
  titre: string;
  items: readonly Item[];
};

export function Gallery({ titre, items }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading titre={titre} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.label} delay={index * 60}>
            <PlaceholderImage ratio="4/3" label={item.label} alt={item.alt} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
