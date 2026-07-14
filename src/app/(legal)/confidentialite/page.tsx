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
        Identité (nom, prénom), coordonnées (téléphone, email) ; réponses du
        parcours (préférence d’aventure, formule choisie, période de départ,
        nombre de voyageurs) ; et, le cas échéant, paramètres de campagne
        (UTM, référent) de votre première visite.
      </p>

      <h2 className={H2_CLASS}>Base légale</h2>
      <p className={P_CLASS}>
        Votre consentement, recueilli par une case à cocher obligatoire et
        non précochée à l’entrée du parcours, couvre l’enregistrement de vos
        coordonnées, la personnalisation du parcours et le recontact au sujet
        de votre projet. Le bouton de la dernière étape confirme ensuite votre
        demande sans vous demander à nouveau ces informations.
      </p>

      <h2 className={H2_CLASS}>Destinataires</h2>
      <p className={P_CLASS}>
        Vos données sont accessibles à l’équipe de {legal.raisonSociale},
        ainsi qu’à ses sous-traitants techniques : Render (hébergement du
        site), Supabase (hébergement de la base de données), Google
        (Google Tag Manager / Google Analytics) et Meta (pixel Meta), ces
        deux derniers sous réserve de votre consentement. Vos données ne
        sont ni vendues ni cédées à des tiers à des fins publicitaires.
      </p>

      <h2 className={H2_CLASS}>Transferts hors Union européenne</h2>
      <p className={P_CLASS}>
        Certains de nos sous-traitants (notamment Google, Meta et Render) sont
        susceptibles de traiter des données en dehors de l’Union européenne,
        notamment aux États-Unis. Ces transferts sont encadrés par des
        garanties appropriées, telles que les clauses contractuelles types
        de la Commission européenne.
      </p>

      <h2 className={H2_CLASS}>Cookies et traceurs</h2>
      <p className={P_CLASS}>
        Le site dépose un cookie technique de courte durée (30 minutes) après
        l’envoi d’un formulaire, uniquement pour personnaliser la page de
        confirmation. Les paramètres de campagne (UTM) sont mémorisés le temps
        de la session de navigation.
      </p>
      <p className={P_CLASS}>
        Lorsque vous validez le formulaire d’entrée, vos nom, prénom, adresse
        email, numéro de téléphone, projet actuel, échéance de départ et, le cas
        échéant, paramètres UTM du premier point d’entrée sont transmis à
        {" "}{legal.raisonSociale} et enregistrés dans une table tampon. Son
        identifiant technique est ensuite relié à votre demande de voyage
        finale, si vous la validez. La valeur de la case de consentement et la
        date de création de cette ligne permettent de conserver la preuve de
        votre choix. Une copie locale, conservée 30 jours maximum, évite de vous
        redemander vos coordonnées et préremplit la suite. Les brouillons de
        questionnaire sont conservés localement pendant 6 heures maximum.
      </p>
      <p className={P_CLASS}>
        Avec votre consentement, recueilli via le bandeau affiché à votre
        arrivée, nous utilisons Google Analytics (chargé par Google Tag Manager)
        pour mesurer l’audience du site, ainsi que le pixel Meta pour mesurer
        la performance de nos campagnes publicitaires. Ces cookies ne sont
        déposés qu’après votre acceptation et ne sont jamais activés si vous
        refusez. Vous pouvez modifier votre choix à tout moment en effaçant
        les cookies du site depuis votre navigateur.
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
