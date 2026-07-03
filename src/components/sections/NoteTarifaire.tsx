export function NoteTarifaire({ texte }: { texte: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
      <p className="rounded-2xl border-2 border-accent-soft bg-surface-2 px-5 py-4 text-sm text-ink-soft">
        <strong className="text-ink-strong">Bon à savoir. </strong>
        {texte}
      </p>
    </section>
  );
}
