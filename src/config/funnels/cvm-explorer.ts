import type { FunnelConfig } from "@/types/funnel";

/**
 * Questionnaire CVM · Expédition Explorer (brief §13.2) — très qualifiant.
 * Règles de texte : jamais de devis ferme, santé = pré-qualification
 * (pas d'avis médical), ne pas glorifier le danger.
 */
export const cvmExplorerFunnel: FunnelConfig = {
  type: "cvm_explorer",
  brand: "cvm",
  label: "Expédition insolite & Missions humanitaires",
  intro: {
    titre: "Expédition insolite & Missions humanitaires",
    sousTitre:
      "Cette expédition n'est pas adaptée à tout le monde. Une expédition réelle, engagée et encadrée, pour les voyageurs prêts à vivre l'effort, le bivouac, l'immersion humaine et l'exploration terrain.",
    note: "Participation soumise à validation physique, médicale et logistique. Certificat médical obligatoire. Prix hors billet d'avion et assurance.",
  },
  cta: "Envoyer ma demande de pré-validation",
  steps: [
    {
      kind: "radio",
      id: "budget",
      name: "budget",
      question: "Quelle enveloppe pour une logistique terrain exigeante ?",
      hint: "Hors billet d'avion international et assurance voyage.",
      options: [
        { value: "1800_2200", label: "1 800 € à 2 200 € — à vérifier, enveloppe serrée pour une expédition réelle" },
        { value: "2200_2500", label: "2 200 € à 2 500 € — possible selon durée, période et logistique" },
        { value: "2500_3000", label: "2 500 € à 3 000 € — enveloppe plus cohérente pour une expérience Explorer structurée" },
        { value: "3000_plus", label: "Plus de 3 000 € — expédition plus complète, longue ou avec logistique renforcée" },
        { value: "conseil", label: "Je ne sais pas encore — je souhaite être conseillé" },
      ],
    },
    {
      kind: "radio",
      id: "capacite_marche",
      name: "capaciteMarche",
      question: "Quelle distance pouvez-vous marcher, plusieurs jours de suite ?",
      options: [
        { value: "moins_10", label: "Moins de 10 km par jour" },
        { value: "10_15", label: "10 à 15 km par jour" },
        { value: "15_20", label: "15 à 20 km par jour" },
        { value: "20_25", label: "20 à 25 km par jour" },
        { value: "autre", label: "Autre niveau — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "terrain_difficile",
      name: "terrainDifficile",
      question: "Quel terrain difficile êtes-vous prêt à affronter ?",
      options: [
        { value: "sentiers_stables", label: "Sentiers simples et terrain stable" },
        { value: "irregulier", label: "Terrain irrégulier, caillouteux ou sableux" },
        { value: "aride", label: "Zone aride ou semi-aride avec chaleur et effort prolongé" },
        { value: "humide", label: "Zone humide, dense, boueuse ou difficile d'accès" },
        { value: "autre", label: "Autre terrain ou expérience — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "bivouac",
      name: "bivouac",
      question: "Le bivouac permanent, vous êtes prêt ?",
      hint: "Deux nuits en hôtel seulement, le reste en bivouac.",
      options: [
        { value: "oui_pleinement", label: "Oui, j'accepte pleinement le bivouac et le confort rustique" },
        { value: "oui_liste_materiel", label: "Oui, si je reçois une liste claire du matériel et des conditions" },
        { value: "jamais_teste", label: "Je n'ai jamais testé, mais je veux être évalué sérieusement" },
        { value: "besoin_confort", label: "J'ai besoin de nuits en hôtel ou d'un confort régulier" },
        { value: "autre", label: "Autre précision — je détaille", freeText: true },
      ],
    },
    {
      kind: "multi",
      id: "sante",
      name: "sante",
      question: "Des points de santé à signaler ?",
      hint: "Plusieurs réponses possibles.",
      message: "Le questionnaire ne remplace pas l'avis d'un professionnel de santé.",
      options: [
        { value: "allergies", label: "Allergies importantes : aliments, piqûres, médicaments ou autre" },
        { value: "articulaire", label: "Problèmes articulaires ou musculaires : dos, genoux, chevilles, épaules" },
        { value: "cardiaque_respiratoire", label: "Problèmes cardiaques, souffle, asthme ou endurance respiratoire" },
        { value: "aucun", label: "Aucun point connu, je peux fournir un certificat médical" },
        { value: "autre", label: "Autre information médicale — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "certificat",
      name: "certificat",
      question: "Le certificat médical est obligatoire pour Explorer. Où en êtes-vous ?",
      options: [
        { value: "oui_recent", label: "Oui, je peux fournir un certificat médical récent" },
        { value: "rdv_a_prendre", label: "Oui, je vais prendre rendez-vous avec mon médecin" },
        { value: "infos_medecin", label: "J'ai besoin d'informations pour que mon médecin évalue le projet" },
        { value: "pas_certain", label: "Je ne suis pas certain que mon médecin validera" },
        { value: "autre", label: "Autre situation — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "faune",
      name: "faune",
      question: "Face à la faune sauvage et l'environnement naturel ?",
      message:
        "Certaines zones peuvent impliquer la présence de reptiles, insectes, arachnides ou autres espèces locales. La sécurité repose sur les guides, les consignes, la distance, l'observation et le respect strict du cadre terrain.",
      options: [
        { value: "respecte_consignes", label: "Je comprends le risque et je respecte strictement les consignes des guides" },
        { value: "impressionnable_encadre", label: "Je peux être impressionné, mais je veux être encadré sérieusement" },
        { value: "forte_apprehension", label: "J'ai une forte appréhension des reptiles, insectes ou animaux sauvages" },
        { value: "pas_exposition", label: "Je ne souhaite pas être exposé à ce type d'environnement" },
        { value: "autre", label: "Autre réaction — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "motivation",
      name: "motivation",
      question: "Qu'est-ce qui vous attire dans l'immersion humaine ?",
      message:
        "Toute action humaine ou solidaire doit être validée avec les partenaires locaux. L'objectif n'est pas de faire du tourisme humanitaire, mais de participer avec respect à une expérience encadrée.",
      options: [
        { value: "rencontrer_comprendre", label: "Rencontrer, comprendre et respecter les réalités du terrain local" },
        { value: "action_utile", label: "Participer à une action utile selon les besoins validés localement" },
        { value: "observer_documenter", label: "Observer, documenter, noter ou cartographier dans un cadre encadré" },
        { value: "explorer_respect", label: "Explorer avant tout, avec respect total des populations et partenaires" },
        { value: "autre", label: "Autre motivation — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "discipline",
      name: "discipline",
      question: "La sécurité dépend de la discipline collective. Votre position ?",
      options: [
        { value: "respecte_consignes", label: "Oui, je respecte les consignes des guides et responsables terrain" },
        { value: "accepte_changement", label: "Oui, j'accepte que l'itinéraire puisse changer selon les conditions" },
        { value: "groupe_solidaire", label: "Oui, je comprends que le groupe doit rester solidaire et discipliné" },
        { value: "besoin_briefing", label: "J'ai besoin d'un briefing clair avant de m'engager" },
        { value: "autre", label: "Autre précision — je détaille", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "materiel",
      name: "materiel",
      question: "Côté matériel et préparation ?",
      options: [
        { value: "equipe", label: "Oui, je suis déjà équipé randonnée / bivouac" },
        { value: "partiel", label: "J'ai une partie du matériel et je peux compléter" },
        { value: "besoin_liste", label: "J'ai besoin d'une liste détaillée et de conseils d'achat" },
        { value: "pas_equipe", label: "Je ne suis pas équipé aujourd'hui" },
        { value: "autre", label: "Autre situation — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "periode",
      name: "periode",
      question: "Quand souhaitez-vous partir ?",
      options: [
        { value: "2_4_mois", label: "Dans 2 à 4 mois" },
        { value: "4_6_mois", label: "Dans 4 à 6 mois" },
        { value: "6_10_mois", label: "Dans 6 à 10 mois" },
        { value: "1_an_plus", label: "Dans 1 an ou plus" },
        { value: "precise", label: "Période précise — je l'indique", freeText: true },
      ],
    },
    {
      kind: "contact",
      id: "coordonnees",
      question: "Demande de pré-validation Explorer",
      message:
        "Cette demande ne confirme pas la participation. Elle permet de vérifier le profil, la condition physique, la motivation et les conditions nécessaires à une expédition sécurisée.",
      fields: ["age", "nbVoyageurs", "commentaire"],
      acceptances: [
        {
          name: "acceptCertificat",
          label: "J'accepte le principe du certificat médical obligatoire.",
        },
        {
          name: "acceptBriefing",
          label: "J'accepte le briefing sécurité avant l'engagement.",
        },
      ],
    },
  ],
};
