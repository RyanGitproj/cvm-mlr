import type { Metadata } from "next";
import { legal } from "@/config/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment vos données sont collectées et utilisées lors d'une demande de voyage.",
};

const H2_CLASS = "mt-10 font-heading text-2xl font-bold text-ink-strong";
const P_CLASS = "mt-4 text-sm leading-relaxed text-ink-soft";

export default function ConfidentialitePage() {
  return (
    <article>
      <h1 className="font-heading text-4xl font-bold text-ink-strong">
        Politique de confidentialité
      </h1>

      <h2 className={H2_CLASS}>Responsable du traitement</h2>
      <p className={P_CLASS}>
        {legal.raisonSociale}, {legal.forme} au capital de {legal.capital},
        dont le siège est situé {legal.siege} (SIREN {legal.siren}).
      </p>

      <h2 className={H2_CLASS}>Finalité du traitement</h2>
      <p className={P_CLASS}>
        Les données transmises via les questionnaires servent à qualifier votre
        demande de voyage et à vous recontacter avec une proposition adaptée.
      </p>

      <h2 className={H2_CLASS}>Données collectées</h2>
      <p className={P_CLASS}>
        Identité (prénom), coordonnées (téléphone, email), réponses de
        qualification (budget, préférences, période, nombre de voyageurs,
        commentaire libre) et, le cas échéant, paramètres de campagne (UTM,
        référent) de votre première visite.
      </p>

      <h2 className={H2_CLASS}>Base légale</h2>
      <p className={P_CLASS}>
        Votre consentement, recueilli par une case à cocher obligatoire avant
        l’envoi de toute demande, ainsi que l’intérêt légitime de la société à
        répondre à votre sollicitation.
      </p>

      <h2 className={H2_CLASS}>Destinataires</h2>
      <p className={P_CLASS}>
        La société éditrice et ses outils de gestion de la relation client.
        Vos données ne sont ni vendues ni cédées à des tiers à des fins
        publicitaires.
      </p>

      <h2 className={H2_CLASS}>Cookies et traceurs</h2>
      <p className={P_CLASS}>
        Le site dépose un unique cookie technique de courte durée (30 minutes)
        après l’envoi d’un formulaire, uniquement pour personnaliser la page de
        confirmation. Les paramètres de campagne (UTM) sont mémorisés le temps
        de la session de navigation. Aucun cookie publicitaire ni traceur tiers
        n’est utilisé.
      </p>

      <h2 className={H2_CLASS}>Durée de conservation</h2>
      <p className={P_CLASS}>{legal.dureeConservation}</p>

      <h2 className={H2_CLASS}>Vos droits</h2>
      <p className={P_CLASS}>
        Conformément au RGPD, vous disposez d’un droit d’accès, de
        rectification, d’effacement et d’opposition sur vos données. Pour
        l’exercer, contactez : {legal.dpoEmail}. Vous pouvez également saisir
        la CNIL (cnil.fr) si vous estimez que vos droits ne sont pas respectés.
      </p>
    </article>
  );
}
