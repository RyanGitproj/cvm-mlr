"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CheckboxField } from "./CheckboxField";
import { PhoneField } from "./PhoneField";
import { TextField } from "./TextField";

/**
 * Coordonnées CVM — écran final de saisie épuré (gabarit maquette
 * 2026-07-07) : identité + contact + consentement RGPD unique + newsletter
 * facultative (décision Ryan 2026-07-07 soir). Le nombre de voyageurs et la
 * période sont des questions du wizard. `conditionsSlot` insère les
 * acceptations réglementaires (Explorer) avant le consentement.
 */
export function ContactFields({ conditionsSlot }: { conditionsSlot?: ReactNode }) {
  return (
    <div className="grid gap-4">
      <TextField name="nom" label="Nom" autoComplete="family-name" />
      <TextField name="prenom" label="Prénom" autoComplete="given-name" optional />
      <PhoneField name="telephone" label="Téléphone" />
      <TextField name="email" label="Email" type="email" autoComplete="email" />
      {conditionsSlot}
      <CheckboxField
        name="consentement"
        label={
          <>
            J’accepte que Célébrations Voyages Madagascar utilise mes données
            pour préparer mon projet de voyage et me recontacter. Voir la{" "}
            <Link href="/confidentialite" className="underline">
              politique de confidentialité
            </Link>
            .
          </>
        }
      />
      <CheckboxField
        name="optinNewsletter"
        label="J’accepte de recevoir la newsletter (facultatif)."
      />
    </div>
  );
}
