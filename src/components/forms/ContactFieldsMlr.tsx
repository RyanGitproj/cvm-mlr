"use client";

import Link from "next/link";
import { CheckboxField } from "./CheckboxField";
import { PhoneField } from "./PhoneField";
import { TextField } from "./TextField";

/**
 * Coordonnées MLR — écran « Ta route est presque prête » (maquette 6 du
 * 2026-07-07). Le nombre de voyageurs et la fenêtre de départ sont des
 * questions du wizard, pas des champs ici. Une case de consentement
 * obligatoire (recontact) + deux opt-ins facultatifs, jamais pré-cochés.
 */
export function ContactFieldsMlr() {
  return (
    <div className="grid gap-4">
      <TextField name="prenom" label="Prénom" autoComplete="given-name" optional />
      <TextField name="nom" label="Nom" autoComplete="family-name" />
      <TextField name="email" label="Email" type="email" autoComplete="email" />
      <PhoneField name="telephone" label="Téléphone ou WhatsApp" />
      <TextField
        name="moisDepart"
        label="Mois de départ"
        placeholder="Novembre 2026"
        optional
      />
      <CheckboxField
        name="consentement"
        label={
          <>
            J’accepte d’être recontacté au sujet de mon projet Liberty Roots.
            Voir la{" "}
            <Link href="/confidentialite" className="underline">
              politique de confidentialité
            </Link>
            .
          </>
        }
      />
      <CheckboxField
        name="optinDocuments"
        label="J’accepte de recevoir la brochure, la vidéo et le devis indicatif."
      />
      <CheckboxField
        name="optinConseils"
        label="J’accepte de recevoir les conseils de préparation par email ou WhatsApp."
      />
    </div>
  );
}
