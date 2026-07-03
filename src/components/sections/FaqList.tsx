type Item = { question: string; reponse: string };

export function FaqList({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-2xl border-2 border-line bg-card p-5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-ink-strong">
            {item.question}
            <span
              aria-hidden
              className="text-lg text-accent transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.reponse}</p>
        </details>
      ))}
    </div>
  );
}
