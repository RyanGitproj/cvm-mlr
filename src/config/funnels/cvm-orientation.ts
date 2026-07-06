import type { FunnelConfig } from "@/types/funnel";
import { NOTE_TARIFAIRE_CVM } from "../brands";

/**
 * Funnel 0 · Orientation CVM (mission Riane) — sas d'entrée pour les
 * visiteurs indécis. Aucune offre : étape 1 = contact seul ; les 8 questions
 * d'aiguillage forment l'étape 2. La sortie recommande un des 4 univers.
 */
export const cvmOrientationFunnel: FunnelConfig = {
  type: "cvm_orientation",
  brand: "cvm",
  label: "Orientation",
  intro: {
    titre: "Quelle expérience à Madagascar correspond vraiment à votre projet ?",
    sousTitre:
      "Expédition, trek encadré, séjour de rêve ou immersion d'un mois : laissez-nous vos coordonnées, puis quelques questions suffisent — vous recevez la brochure, la vidéo et la proposition faites pour votre profil.",
    note: NOTE_TARIFAIRE_CVM,
  },
  ctaStep1: "Enregistrer mes coordonnées",
  contact: {
    id: "coordonnees",
    question: "Vos coordonnées",
    hint: "Réponse sous 24 h · recommandation personnalisée · hors vol & assurance.",
    message:
      "Vous recevrez la brochure, la vidéo et la proposition correspondant à votre profil. Le billet d'avion et l'assurance voyage restent à prévoir séparément.",
  },
  qualification: [
    {
      kind: "radio",
      id: "budget",
      name: "budget",
      question: "Quelle enveloppe de projet envisagez-vous ?",
      hint: "Votre enveloppe concerne l'expérience sur place — hors billet d'avion international et assurance voyage.",
      options: [
        { value: "1800_2200", label: "Entre 1 800 € et 2 200 € — expérience optimisée, courte ou simple" },
        { value: "2200_2500", label: "Entre 2 200 € et 2 500 € — aventure structurée avec organisation locale" },
        { value: "2500_3000", label: "Entre 2 500 € et 3 000 € — expérience plus complète, immersive ou confortable" },
        { value: "3000_plus", label: "Plus de 3 000 € — expérience longue, premium, très accompagnée ou immersion d'un mois" },
        { value: "conseil", label: "Je ne sais pas encore — je souhaite être conseillé" },
      ],
    },
    {
      kind: "radio",
      id: "intention",
      name: "intention",
      question: "Quel voyage avez-vous en tête ?",
      options: [
        { value: "explorer", label: "Une aventure insolite hors des circuits touristiques" },
        { value: "treks", label: "Un trek ou circuit aventure encadré et sécurisé" },
        { value: "iles", label: "Des plages paradisiaques, des îles et un séjour détente" },
        { value: "un_mois", label: "Un mois d'immersion pour découvrir Madagascar en profondeur" },
        { value: "autre", label: "Autre projet — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "delai",
      name: "delai",
      question: "Quand souhaitez-vous partir ?",
      options: [
        { value: "2_4_mois", label: "Dans 2 à 4 mois" },
        { value: "4_6_mois", label: "Dans 4 à 6 mois" },
        { value: "6_10_mois", label: "Dans 6 à 10 mois" },
        { value: "1_an_plus", label: "Dans 1 an ou plus" },
        { value: "precise", label: "J'ai une période précise — je l'indique", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "duree",
      name: "duree",
      question: "Quelle durée souhaitez-vous ?",
      options: [
        { value: "7_10", label: "7 à 10 jours" },
        { value: "10_15", label: "10 à 15 jours" },
        { value: "15_21", label: "15 à 21 jours" },
        { value: "un_mois", label: "Environ un mois" },
        { value: "autre", label: "Autre durée — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "confort",
      name: "confort",
      question: "Quel niveau de confort vous correspond ?",
      options: [
        { value: "rustique", label: "Rustique / expédition : bivouac, tente, matelas gonflable, confort simple accepté" },
        { value: "simple_encadre", label: "Simple mais encadré : hôtels simples, lodges, confort basique mais organisé" },
        { value: "mixte", label: "Mixte : aventure en journée, repos plus confortable le soir" },
        { value: "premium", label: "Confort / premium : hébergements agréables, détente, sérénité, services renforcés" },
        { value: "autre", label: "Autre niveau de confort — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "niveau_physique",
      name: "niveauPhysique",
      question: "Quel est votre niveau physique réel ?",
      options: [
        { value: "moderee", label: "Modérée : je marche occasionnellement, sans pratique sportive régulière" },
        { value: "active", label: "Active : je peux marcher plusieurs heures dans une journée" },
        { value: "sportive", label: "Sportive : je peux marcher 10 à 15 km plusieurs jours de suite" },
        { value: "tres_sportive", label: "Très sportive : je peux envisager 15 à 25 km par jour en terrain difficile" },
        { value: "autre", label: "Autre situation — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "imprevu",
      name: "imprevu",
      question: "Quel est votre rapport à l'imprévu ?",
      options: [
        { value: "tres_organise", label: "Je préfère un voyage très organisé et confortable" },
        { value: "accepte_imprevus", label: "J'accepte quelques imprévus si le cadre reste sécurisé" },
        { value: "adapte_terrain", label: "Je suis prêt à m'adapter aux conditions terrain" },
        { value: "comprendre_pays", label: "Je veux surtout comprendre le pays pour me projeter" },
        { value: "autre", label: "Autre réaction — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "objectif",
      name: "objectif",
      question: "Au fond, qu'est-ce que vous cherchez ?",
      options: [
        { value: "depassement", label: "Me dépasser et vivre quelque chose de rare" },
        { value: "paysages_cadre", label: "Découvrir des paysages forts avec un cadre rassurant" },
        { value: "detente", label: "Me détendre dans un décor paradisiaque" },
        { value: "projet_de_vie", label: "Comprendre Madagascar avant un projet de vie ou d'activité" },
        { value: "autre", label: "Autre objectif — je précise", freeText: true },
      ],
    },
  ],
};
