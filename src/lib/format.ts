/** Formatage FR des montants (euros entiers) — source unique d'affichage prix. */
const EUROS = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuros(montant: number): string {
  return EUROS.format(montant);
}
