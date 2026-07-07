"use client";

import Link from "next/link";
import { CheckboxField } from "./CheckboxField";
import { PhoneField } from "./PhoneField";
import { TextField } from "./TextField";

/**
 * Coordonnées MLR — écran « Ta route est presque prête » (maquette 6 du
 * 2026-07-07). Le nombre de voyageurs et la fenêtre de départ sont des
 * questions du wizard, pas des champs ici. RGPD simplifié (décision Ryan
 * 2026-07-07 soir) : UNE case obligatoire qui couvre l'utilisation des
 * données (préparation du voyage, envoi des documents, recontact) + une
 * newsletter facultative, jamais pré-cochée.
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
            J’accepte que Madagascar Liberty Roots utilise mes données pour
            préparer mon voyage, m’envoyer ma proposition et me recontacter.
            Voir la{" "}
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
