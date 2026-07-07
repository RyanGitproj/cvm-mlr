import { splitOptionLabel } from "@/lib/optionLabel";
import type { DepartFenetre } from "@/lib/validations/common";
import type { FunnelConfig } from "@/types/funnel";

/**
 * Chips de récapitulatif de l'écran final (maquettes 7/8 :
 * « Ouest · 15 jours · 2 voyageurs · Départ dans 4 à 6 mois »).
 * Fonction pure sur la config + les valeurs du formulaire — les valeurs
 * inconnues sont simplement omises, jamais inventées.
 */

const DEPART_LABELS: Record<DepartFenetre, string> = {
  "0_2": "Départ dans 0 à 2 mois",
  "2_4": "Départ dans 2 à 4 mois",
  "4_6": "Départ dans 4 à 6 mois",
  "6_10": "Départ dans 6 à 10 mois",
  "10_plus": "Départ dans plus de 10 mois",
};

function isDepartFenetre(value: unknown): value is DepartFenetre {
  return typeof value === "string" && value in DEPART_LABELS;
}

/** Titre court de l'option Q1 choisie (« Le Nord », « Nord », « Nosy Be »…). */
function q1Chip(
  config: FunnelConfig,
  values: Record<string, unknown>,
): string | null {
  const firstRadio = config.steps.find((step) => step.kind === "radio");
  if (firstRadio === undefined) return null;
  const value = values[firstRadio.name];
  const option = firstRadio.options.find((o) => o.value === value);
  if (option === undefined) return null;
  return splitOptionLabel(option.label).title;
}

function dureeChip(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const jours = /^(\d+)_jours$/.exec(value);
  if (jours !== null) return `${jours[1]} jours`;
  if (value === "un_mois") return "Environ 1 mois";
  return null;
}

function voyageursChip(value: unknown): string | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  if (value === "1") return "1 voyageur";
  // La carte « 4 » se libelle « Nous sommes 4 ou plus » (plancher indicatif).
  if (value === "4") return "4 voyageurs ou plus";
  return `${value} voyageurs`;
}

export function recapChips(
  config: FunnelConfig,
  values: Record<string, unknown>,
): string[] {
  const chips = [
    q1Chip(config, values),
    dureeChip(values.offreDuree),
    voyageursChip(values.nbVoyageurs),
    isDepartFenetre(values.departFenetre)
      ? DEPART_LABELS[values.departFenetre]
      : null,
  ];
  return chips.filter((chip): chip is string => chip !== null);
}
