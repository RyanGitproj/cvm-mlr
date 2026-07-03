"use client";

import Link from "next/link";
import type { ContactStep } from "@/types/funnel";
import { CheckboxField } from "./CheckboxField";
import { TextAreaField, TextField } from "./TextField";

/** Étape coordonnées : prénom/téléphone/email + champs configurés + RGPD. */
export function ContactFields({ step }: { step: ContactStep }) {
  return (
    <div className="grid gap-4">
      <TextField name="prenom" label="Prénom" autoComplete="given-name" />
      <TextField
        name="telephone"
        label="Téléphone"
        type="tel"
        autoComplete="tel"
        placeholder="Votre numéro"
      />
      <TextField name="email" label="Email" type="email" autoComplete="email" />
      {step.fields.includes("periode") && (
        <TextField
          name="periode"
          label="Période souhaitée"
          placeholder="Ex. octobre 2026"
        />
      )}
      {step.fields.includes("nbVoyageurs") && (
        <TextField
          name="nbVoyageurs"
          label="Nombre de voyageurs"
          type="number"
          min={1}
          max={20}
        />
      )}
      {step.fields.includes("age") && (
        <TextField name="age" label="Âge" type="number" min={16} max={99} optional />
      )}
      {step.fields.includes("commentaire") && (
        <TextAreaField
          name="commentaire"
          label="Commentaire libre"
          placeholder="Dites-nous en plus sur votre projet…"
          optional
        />
      )}
      {step.acceptances?.map((acceptance) => (
        <CheckboxField
          key={acceptance.name}
          name={acceptance.name}
          label={acceptance.label}
        />
      ))}
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
