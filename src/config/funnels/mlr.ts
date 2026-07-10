import { MLR_LANDING, MLR_ROUTES_CONTENT } from "@/config/content/mlr";
import type { FunnelConfig, RadioStep } from "@/types/funnel";

/**
 * Funnel MLR — wizard 4 questions (maquettes boss 2026-07-07, vocal =
 * source d'autorité) : route → niveau d'aventure (offre) → fenêtre de
 * départ → voyageurs, puis coordonnées et écran final conditionnel.
 * Le wizard tutoie le lead (phrases du boss reprises quasi verbatim,
 * marque corrigée : « Liberty Roots », jamais « Liberty Routes »).
 */

/** Q1 — les cartes route reprennent le wording landing (source unique). */
const routeStep: RadioStep = {
  kind: "radio",
  id: "route",
  name: "route",
  question: "Quelle route t'appelle le plus ?",
  hint: "Deux visages de Madagascar. Deux façons de sentir la piste.",
  // « Je ne sais pas encore » retirée le 2026-07-07 au soir (demande Ryan) :
  // le choix se fait entre les 2 routes du catalogue.
  options: MLR_LANDING.routes.map((route) => ({
    value: route.slug,
    label: route.titre,
    description: route.texte,
    image: MLR_ROUTES_CONTENT[route.slug].imageAmbiance,
  })),
};

export const mlrFunnel: FunnelConfig = {
  type: "mlr",
  brand: "mlr",
  label: "Road Trip Liberty Roots",
  intro: {
    titre: "Trouve la route qui te correspond",
    sousTitre:
      "Nord ou Ouest, 10 ou 15 jours : réponds en moins d'une minute, on prépare ta route avec un guide local à tes côtés.",
    note: "Les hôtels, restaurants hors campement, vols et assurances restent à ta charge pour garder ta liberté de choix.",
  },
  steps: [
    routeStep,
    {
      kind: "offer",
      id: "niveau_aventure",
      question: "Quel niveau d'aventure veux-tu vraiment vivre ?",
      hint: "Ici, on ne déguise pas l'aventure. Tu choisis ton rythme, ton confort et ton niveau d'immersion.",
      reorientation: {
        label: "Je préfère un voyage plus organisé",
        hint: "Plus de confort, plus de prise en charge, plus de clé en main.",
        href: "/cvm",
        cta: "Voir Célébrations Voyages",
        image: {
          label: "Univers Célébrations Voyages",
          alt: "4x4 chargé sur une route bordée de baobabs, plus de confort et de prise en charge",
          src: "/images/mlr/reorientation-cvm-4x4.png",
          // Visuel cadré portrait pour la vignette mobile étroite (art-direction).
          mobileSrc: "/images/mlr/reorientation-cvm-mobile.png",
        },
      },
    },
    {
      kind: "radio",
      id: "depart_fenetre",
      name: "departFenetre",
      question: "Quand sens-tu que Madagascar t'appelle ?",
      hint: "Plus ton départ approche, plus il est utile de préparer la route, les vols et ton guide au bon moment.",
      message:
        "Réserver plus tôt = plus de choix et souvent de meilleurs prix sur les vols.",
      options: [
        { value: "0_2", label: "0 à 2 mois", description: "Je veux partir très bientôt" },
        { value: "2_4", label: "2 à 4 mois", description: "Je m'organise sérieusement" },
        { value: "4_6", label: "4 à 6 mois", description: "Le bon moment pour préparer intelligemment" },
        { value: "6_10", label: "6 à 10 mois", description: "Je construis mon projet sans me précipiter" },
        { value: "10_plus", label: "+ de 10 mois", description: "Je veux garder le lien et rêver encore" },
      ],
    },
    {
      kind: "radio",
      id: "voyageurs",
      name: "nbVoyageurs",
      question: "Combien de places doit-on garder sur la route ?",
      hint: "Liberty Roots se vit en petit groupe, jusqu'à 4 personnes, pour garder la liberté, la proximité et l'immersion.",
      // Les exclusions sont un simple texte d'info depuis le 2026-07-09
      // (demande Ryan) — l'ancienne case de compréhension a été retirée.
      message: [
        "Guide local inclus · Petit groupe · Circuit organisé",
        "Les vols, hôtels et restaurants ne sont pas inclus : le guide t'aidera à avancer selon ton rythme et ton budget.",
      ],
      options: [
        { value: "1", label: "Je pars seul" },
        { value: "2", label: "Nous sommes 2" },
        { value: "3", label: "Nous sommes 3" },
        { value: "4", label: "Nous sommes 4" },
        // « Plus de 4 » révèle le champ nombre — l'effectif réel est stocké
        // (décision Ryan 2026-07-07 : plus de plancher indicatif).
        {
          value: "plus",
          label: "Plus de 4",
          freeText: true,
          precisionInput: {
            label: "Vous serez combien, environ ?",
            placeholder: "6",
            min: 5,
            max: 20,
          },
        },
      ],
    },
  ],
  contact: {
    id: "coordonnees",
    variant: "mlr",
    question: "Ta route est presque prête. Où veux-tu la recevoir ?",
    hint: "On va t'envoyer ta brochure Liberty Roots, ta vidéo de présentation et ton devis indicatif selon tes choix.",
    message:
      "Devis de présentation, non définitif : un devis indicatif, adapté à tes envies, ajusté ensemble si besoin. Tes informations restent confidentielles, elles servent uniquement à préparer ta proposition et à te recontacter.",
    cta: "Recevoir ma route",
  },
  final: {
    cases: {
      proche: {
        titre: "Ton départ approche : c'est le bon moment pour préparer la route.",
        texte:
          "Un expert malgache peut t'aider à choisir la bonne route, anticiper les vols, préparer ton guide et éviter les mauvaises surprises.",
        piliers: [
          "Parler avec un expert Malgache",
          "Vérifier les vols au bon moment",
          "Préparer ton aventure en confiance",
        ],
        reassurance: "Ce rendez-vous ne t'engage à rien.",
        cta: { label: "Choisir mon créneau avec un expert malgache", suite: "rdv" },
      },
      construction: {
        titre: "Tu es dans le bon timing pour construire ton voyage.",
        texte:
          "Tu as encore le temps de préparer ton projet, mais c'est maintenant que les bons choix commencent : route, durée, rythme, billets d'avion.",
        reassurance:
          "Tu n'as pas besoin de tout décider maintenant. Mais tu peux déjà choisir la bonne direction.",
        cta: { label: "Recevoir ma brochure + réserver un échange", suite: "rdv" },
      },
      lointain: {
        titre: "Madagascar t'appelle… ton projet a encore le temps de mûrir.",
        texte:
          "Nous t'envoyons la brochure Liberty Roots, la vidéo et ton devis indicatif. Quand ton départ approchera, nous te proposerons un échange au bon moment.",
        cta: { label: "Je préfère quand même parler à un expert malgache", suite: "rdv" },
      },
    },
  },
};
