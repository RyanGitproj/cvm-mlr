import type { FunnelConfig } from "@/types/funnel";

/**
 * Funnel MLR — parcours unique en 7 étapes (brief §8.1 / §13.5), libellés
 * alignés écran par écran sur Madagascar_Liberty_Roots_Funnel_8_visuels.
 * La route est l'étape 2, une réponse du formulaire. Pas de question
 * transport ni hébergement : confirmé par les brochures.
 */
export const mlrFunnel: FunnelConfig = {
  type: "mlr",
  brand: "mlr",
  label: "Road Trip Liberty",
  intro: {
    titre: "Choisissez votre aventure roots à Madagascar",
    sousTitre:
      "Guide local privé, taxi-brousse, itinéraire préparé : l'aventure authentique, en liberté et à votre rythme.",
    note: "Les hôtels, restaurants hors campement, vols et assurances restent à votre charge pour garder votre liberté de choix.",
  },
  cta: "Recevoir mon itinéraire Liberty",
  steps: [
    {
      kind: "radio",
      id: "duree",
      name: "duree",
      question: "Combien de temps voulez-vous partir ?",
      hint: "Avec la formule Liberty Roots, vous bénéficiez d'un guide local privé, d'un itinéraire préparé, des trajets prévus en taxi-brousse et d'une assistance pendant votre voyage.",
      message:
        "Hôtels et restaurants hors campement non inclus. Vous restez libre de choisir selon vos envies et votre budget.",
      options: [
        { value: "10_jours", label: "10 jours — dès 1 442 €" },
        { value: "15_jours", label: "15 jours — dès 1 855 €" },
        {
          value: "a_conseiller",
          label: "Je souhaite être conseillé — nos experts vous aident à choisir la durée idéale",
        },
      ],
    },
    {
      kind: "radio",
      id: "route",
      name: "route",
      question: "Quelle route vous attire le plus ?",
      hint: "Choisissez l'ambiance de voyage qui vous ressemble. Nous adaptons le rythme, le niveau roots et les étapes.",
      options: [
        { value: "nord", label: "Nord — reliefs, baies, cascades, villages" },
        { value: "sud", label: "Sud — pistes rouges, canyons, villages, grands espaces" },
        { value: "est", label: "Est — forêt tropicale, lémuriens, sentiers, ambiance verte" },
        { value: "ouest", label: "Ouest — baobabs, pistes, villages isolés, grands horizons" },
        {
          value: "a_orienter",
          label: "Je veux être orienté — aidez-moi à choisir selon mes envies et objectifs",
        },
      ],
    },
    {
      kind: "radio",
      id: "pret_roots",
      name: "pretRoots",
      question: "Êtes-vous prêt pour une aventure roots à Madagascar ?",
      hint: "Cette expérience implique des transports locaux, de la débrouillardise, des hébergements simples, des rencontres locales et le respect des consignes de sécurité.",
      message:
        "Liberty Roots n'est pas une formule confort. Si vous cherchez plus de sérénité, nous pouvons vous orienter vers Célébration Voyages Madagascar.",
      options: [
        { value: "oui_local_simple", label: "Oui, je veux voyager local, simple et encadré" },
        { value: "oui_comprendre_regles", label: "Oui, mais je souhaite comprendre les règles" },
        {
          value: "hesite_prefere_confort",
          label: "J'hésite, je préfère comparer avec une formule plus confortable",
        },
        { value: "veut_conseil", label: "Je veux d'abord être conseillé" },
      ],
    },
    {
      kind: "radio",
      id: "securite",
      name: "securite",
      question: "La liberté demande des codes",
      hint: "Votre guide local vous accompagne, mais voyager en mode roots demande de respecter des consignes simples : pas de sortie seul après 21 h, suivre les recommandations du guide, éviter bijoux et objets trop voyants, vérifier l'eau en bouteille bien scellée, privilégier les restaurants recommandés, garder son argent séparé.",
      message:
        "Votre comportement fait partie de votre sécurité. Notre équipe locale est disponible 7j/7 pour vous assister — avant, pendant et après le voyage.",
      options: [
        { value: "respecte_consignes", label: "Je respecte les consignes du guide" },
        { value: "veut_encadrement", label: "Je veux être encadré" },
        { value: "experience_terrain", label: "J'ai déjà de l'expérience terrain" },
        { value: "besoin_briefing", label: "J'ai besoin d'un briefing clair" },
        { value: "autre", label: "Autre — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "budget_jour",
      name: "budgetJour",
      question: "Quel budget quotidien prévoyez-vous sur place ?",
      hint: "Liberty Roots laisse à la charge du voyageur ses dépenses personnelles sur place : hôtels et restaurants hors campement, boissons, souvenirs, etc. À titre indicatif : repas local 2 à 4 €, restaurant standard 6 à 10 €, hôtel simple 20 à 35 €, budget conseillé 45 à 75 € / jour.",
      options: [
        { value: "moins_35", label: "Moins de 35 € / jour" },
        { value: "35_50", label: "35 à 50 € / jour" },
        { value: "50_75", label: "50 à 75 € / jour" },
        { value: "plus_75", label: "Plus de 75 € / jour" },
        { value: "conseil", label: "Je veux être conseillé" },
      ],
    },
    {
      kind: "recap",
      id: "recap",
      question: "Récapitulatif de votre demande",
      hint: "Vérifiez vos réponses avant de recevoir votre itinéraire — guide privé inclus.",
    },
    {
      kind: "contact",
      id: "coordonnees",
      question: "Où pouvons-nous vous envoyer votre itinéraire Liberty ?",
      hint: "Recevez votre itinéraire personnalisé et confidentiel, conçu selon vos envies et votre profil de voyageur. Téléphone ou WhatsApp.",
      message:
        "Vos données sont sécurisées et confidentielles. Hôtels, restaurants hors campement, vols et assurances à prévoir séparément.",
      fields: ["periode", "nbVoyageurs", "commentaire"],
    },
  ],
};
