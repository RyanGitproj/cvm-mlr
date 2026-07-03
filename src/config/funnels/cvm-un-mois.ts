import type { FunnelConfig } from "@/types/funnel";

/**
 * Questionnaire CVM · Un mois à Madagascar (brief §13.4).
 * Prudence obligatoire : admin/fiscal/juridique = orientation, pas conseil.
 */
export const cvmUnMoisFunnel: FunnelConfig = {
  type: "cvm_un_mois",
  brand: "cvm",
  label: "Grand Tour Madagascar",
  intro: {
    titre: "Préparez votre Grand Tour de Madagascar",
    sousTitre:
      "Un programme d'immersion pour comprendre le pays, ses régions et son rythme de vie avant une décision personnelle, professionnelle ou entrepreneuriale.",
    note: "Les sujets administratifs, fiscaux, juridiques, résidence ou société doivent être confirmés auprès de professionnels compétents. Le programme peut orienter, mais ne remplace pas un conseil spécialisé.",
  },
  cta: "Recevoir le programme Grand Tour Madagascar",
  steps: [
    {
      kind: "radio",
      id: "budget",
      name: "budget",
      question: "Quelle enveloppe pour un mois complet sur place ?",
      hint: "Hors billet d'avion international et assurance voyage — hébergement, déplacements, accompagnement et repérages.",
      options: [
        { value: "1800_2200", label: "1 800 € à 2 200 € — enveloppe très limitée pour un mois complet, à vérifier" },
        { value: "2200_2500", label: "2 200 € à 2 500 € — programme optimisé, à construire avec prudence" },
        { value: "2500_3000", label: "2 500 € à 3 000 € — programme plus structuré selon durée réelle et confort" },
        { value: "3000_plus", label: "Plus de 3 000 € — profil le plus adapté à une expérience longue, accompagnée ou stratégique" },
        { value: "conseil", label: "Je ne sais pas encore — je souhaite être conseillé" },
      ],
    },
    {
      kind: "radio",
      id: "objectif_mois",
      name: "objectifMois",
      question: "Quel est l'objectif de ce mois ?",
      options: [
        { value: "expatriation", label: "Projet d'expatriation ou changement de vie" },
        { value: "creation_societe", label: "Création de société, investissement ou activité professionnelle" },
        { value: "retraite", label: "Retraite, long séjour ou résidence partielle" },
        { value: "decouverte", label: "Découverte approfondie du pays avant décision" },
        { value: "autre", label: "Autre projet — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "maturite",
      name: "maturite",
      question: "Où en est votre projet ?",
      options: [
        { value: "premiere_reflexion", label: "Première réflexion, je veux comprendre le pays" },
        { value: "serieux_compare", label: "Projet sérieux, je compare encore plusieurs options" },
        { value: "avance", label: "Projet avancé, je souhaite me déplacer prochainement" },
        { value: "engage", label: "Projet déjà engagé, j'ai besoin d'un repérage structuré" },
        { value: "autre", label: "Autre situation — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "horizon",
      name: "periode",
      question: "Quel horizon de départ ?",
      options: [
        { value: "2_4_mois", label: "Dans 2 à 4 mois" },
        { value: "4_6_mois", label: "Dans 4 à 6 mois" },
        { value: "6_10_mois", label: "Dans 6 à 10 mois" },
        { value: "1_an_plus", label: "Dans 1 an ou plus" },
        { value: "precise", label: "Période précise — je l'indique", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "sujets",
      name: "sujets",
      question: "Quels sujets voulez-vous approfondir en priorité ?",
      options: [
        { value: "cadre_de_vie", label: "Régions, villes, cadre de vie et quotidien" },
        { value: "activite_partenaires", label: "Création d'activité, partenaires, opportunités locales" },
        { value: "logement_installation", label: "Logement, quartiers, installation, rythme de vie" },
        { value: "administratif", label: "Administratif, résidence, fiscalité ou société — orientation uniquement" },
        { value: "autre", label: "Autre sujet — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "regions",
      name: "regions",
      question: "Quelles régions découvrir ?",
      options: [
        { value: "tana_hautes_terres", label: "Antananarivo, Hautes Terres et centres économiques" },
        { value: "nord", label: "Le Nord : Diego, Nosy Be, littoral et opportunités touristiques" },
        { value: "est", label: "L'Est : Sainte-Marie, nature, littoral, ambiance sauvage" },
        { value: "ouest_sud", label: "L'Ouest / Sud : Morondava, Tuléar, grands espaces et potentiel régional" },
        { value: "quatre_coins", label: "Je veux découvrir les quatre coins du pays" },
      ],
    },
    {
      kind: "radio",
      id: "accompagnement",
      name: "accompagnement",
      question: "Quel niveau d'accompagnement ?",
      options: [
        { value: "tres_accompagne", label: "Très accompagné : programme structuré, contacts, repères, conseils" },
        { value: "semi_guide", label: "Semi-guidé : itinéraire préparé avec temps libre" },
        { value: "autonome", label: "Autonome avec points de contact et recommandations" },
        { value: "orientation_business", label: "Orientation business avec rendez-vous ciblés si possible" },
        { value: "autre", label: "Autre besoin — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "situation",
      name: "situation",
      question: "Vous partez dans quelle configuration ?",
      options: [
        { value: "seul", label: "Seul" },
        { value: "couple", label: "En couple" },
        { value: "famille", label: "En famille" },
        { value: "associe", label: "Avec associé, investisseur ou partenaire professionnel" },
        { value: "autre", label: "Autre configuration — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "confort",
      name: "confort",
      question: "Quel confort pour une expérience longue ?",
      options: [
        { value: "simple_eco", label: "Simple et économique" },
        { value: "correct", label: "Confort correct et fonctionnel" },
        { value: "superieur", label: "Confort supérieur pour travailler et se projeter sereinement" },
        { value: "premium", label: "Premium avec accompagnement renforcé" },
        { value: "autre", label: "Autre attente — je précise", freeText: true },
      ],
    },
    {
      kind: "contact",
      id: "coordonnees",
      question: "Recevez le programme Grand Tour Madagascar",
      hint: "Réponse sous 24 h · pré-programme personnalisé · hors vol & assurance.",
      fields: ["nbVoyageurs", "commentaire"],
    },
  ],
};
