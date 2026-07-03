import type { FunnelConfig } from "@/types/funnel";
import { NOTE_TARIFAIRE_CVM } from "../brands";

/** Questionnaire CVM · Îles de Rêve (brief §13.3) — plus visuel, plus simple. */
export const cvmIlesFunnel: FunnelConfig = {
  type: "cvm_iles",
  brand: "cvm",
  label: "Séjour Collection Plages de rêves & îles paradisiaques",
  intro: {
    titre: "Composez votre Séjour Collection",
    sousTitre:
      "Plages, lagons, détente et confort — Nosy Be, Sainte-Marie ou séjour combiné : dites-nous votre ambiance, on compose le reste.",
    note: NOTE_TARIFAIRE_CVM,
  },
  cta: "Recevoir mon Séjour Collection",
  steps: [
    {
      kind: "radio",
      id: "budget",
      name: "budget",
      question: "Quelle enveloppe pour votre séjour sur place ?",
      hint: "Hors billet d'avion international et assurance voyage.",
      options: [
        { value: "1800_2200", label: "1 800 € à 2 200 € — séjour optimisé, charme simple ou durée courte" },
        { value: "2200_2500", label: "2 200 € à 2 500 € — séjour confortable avec activités sélectionnées" },
        { value: "2500_3000", label: "2 500 € à 3 000 € — séjour plus complet, meilleur confort ou combiné" },
        { value: "3000_plus", label: "Plus de 3 000 € — séjour premium, îles, expériences privées ou durée longue" },
        { value: "conseil", label: "Je ne sais pas encore — je souhaite être conseillé" },
      ],
    },
    {
      kind: "radio",
      id: "destination",
      name: "destination",
      question: "Quelle destination vous fait rêver ?",
      options: [
        { value: "nosy_be", label: "Nosy Be et ses îles : lagons, excursions, plages, confort balnéaire" },
        { value: "sainte_marie", label: "Sainte-Marie : plus sauvage, exotique, historique, ancien univers de pirates" },
        { value: "combine", label: "Combiné circuit touristique sécurisé + île de rêve : découverte + repos" },
        { value: "selon_saison", label: "La meilleure option selon la saison et mon budget" },
        { value: "autre", label: "Autre envie — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "ambiance",
      name: "ambiance",
      question: "Quelle ambiance pour ce séjour ?",
      options: [
        { value: "romantique", label: "Romantique : couple, lune de miel, moment à deux" },
        { value: "detente", label: "Détente et décontraction : repos, plage, douceur" },
        { value: "famille_amis", label: "Famille ou amis : beau séjour simple à vivre ensemble" },
        { value: "festif_chic", label: "Festif chic : sorties, ambiance, expériences privées" },
        { value: "autre", label: "Autre ambiance — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "activites",
      name: "activites",
      question: "Quelles activités vous tentent le plus ?",
      options: [
        { value: "spa_bien_etre", label: "Massage, spa, bien-être et repos" },
        { value: "snorkeling", label: "Snorkeling : masque et tuba, sans bouteille" },
        { value: "plongee", label: "Plongée sous-marine avec bouteille ou baptême encadré" },
        { value: "excursions", label: "Quad, bateau, excursions et découverte des îles" },
        { value: "autre", label: "Autre activité — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "rythme",
      name: "rythme",
      question: "Quel rythme de séjour ?",
      options: [
        { value: "repos_max", label: "Repos maximum : plage, hôtel, détente" },
        { value: "equilibre", label: "Équilibre : détente + quelques excursions" },
        { value: "actif_confortable", label: "Actif mais confortable : activités presque tous les jours" },
        { value: "combine", label: "Combiné : circuit découverte puis plage de rêve" },
        { value: "autre", label: "Autre rythme — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "confort",
      name: "confort",
      question: "Quel niveau de confort ?",
      options: [
        { value: "charme_simple", label: "Charme simple et authentique" },
        { value: "confort_agreable", label: "Confort agréable et bien situé" },
        { value: "premium", label: "Premium : belle adresse, cadre soigné, services renforcés" },
        { value: "luxe", label: "Luxe / boutique / expérience exclusive" },
        { value: "autre", label: "Autre attente — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "voyageurs",
      name: "voyageurs",
      question: "Vous voyagez comment ?",
      options: [
        { value: "couple", label: "En couple" },
        { value: "famille", label: "En famille" },
        { value: "amis", label: "Entre amis" },
        { value: "solo", label: "Seul / solo" },
        { value: "autre", label: "Autre configuration — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "duree",
      name: "duree",
      question: "Combien de temps sur place ?",
      options: [
        { value: "7", label: "7 jours" },
        { value: "10", label: "10 jours" },
        { value: "14", label: "14 jours" },
        { value: "14_plus", label: "Plus de 14 jours" },
        { value: "autre", label: "Autre durée — je précise", freeText: true },
      ],
    },
    {
      kind: "contact",
      id: "coordonnees",
      question: "Recevez votre Séjour Collection",
      hint: "Réponse sous 24 h · proposition personnalisée · hors vol & assurance.",
      fields: ["periode", "nbVoyageurs", "commentaire"],
    },
  ],
};
