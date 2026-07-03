type Item = { titre: string; texte: string };

export function ReassuranceBar({ items }: { items: readonly Item[] }) {
  return (
    <section className="border-y border-line bg-surface-2">
      <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.titre}>
            <p className="text-sm font-semibold text-ink-strong">{item.titre}</p>
            <p className="mt-1 text-sm text-ink-soft">{item.texte}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
