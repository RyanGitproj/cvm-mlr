"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CheckboxField } from "./CheckboxField";
import { PhoneField } from "./PhoneField";
import { TextAreaField, TextField } from "./TextField";

/**
 * Coordonnées communes (composant b) — identiques pour tous les funnels.
 * Nom obligatoire, prénom facultatif ; période en texte libre. `offerSlot`
 * insère le choix d'offre (et la route MLR) au-dessus du nombre de
 * participants — l'étape 1 tient sur un seul écran.
 */
export function ContactFields({ offerSlot }: { offerSlot?: ReactNode }) {
  return (
    <div className="grid gap-4">
      <TextField name="nom" label="Nom" autoComplete="family-name" />
      <TextField name="prenom" label="Prénom" autoComplete="given-name" optional />
      <PhoneField name="telephone" label="Téléphone" />
      <TextField name="email" label="Email" type="email" autoComplete="email" />
      {offerSlot}
      <TextField
        name="nbVoyageurs"
        label="Nombre de participants"
        type="number"
        min={1}
        max={20}
      />
      <TextField
        name="periode"
        label="Période souhaitée"
        placeholder="Octobre 2026"
      />
      <TextAreaField
        name="commentaire"
        label="Commentaire libre"
        placeholder="Dites-nous en plus sur votre projet…"
        optional
      />
      <CheckboxField
        name="consentement"
        label={
          <>
            J’accepte que mes réponses soient utilisées pour préparer ma
            proposition de voyage et me recontacter. Voir la{" "}
            <Link href="/confidentialite" className="underline">
              politique de confidentialité
            </Link>
            .
          </>
        }
      />
    </div>
  );
}
