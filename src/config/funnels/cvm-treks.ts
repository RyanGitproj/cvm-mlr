import type { FunnelConfig } from "@/types/funnel";
import { NOTE_TARIFAIRE_CVM } from "../brands";

/** Questionnaire CVM · Treks Aventure — gabarit de référence (brief §13.1). */
export const cvmTreksFunnel: FunnelConfig = {
  type: "cvm_treks",
  brand: "cvm",
  label: "Trek Aventure",
  intro: {
    titre: "Composez votre Trek Aventure",
    sousTitre:
      "L'aventure encadrée, à l'intensité maîtrisée. Dites-nous votre niveau, vos décors et votre confort : vous recevez un itinéraire adapté, pas une offre générique.",
    note: NOTE_TARIFAIRE_CVM,
  },
  cta: "Recevoir mon itinéraire Trek Aventure",
  steps: [
    {
      kind: "radio",
      id: "budget",
      name: "budget",
      question: "Quelle enveloppe envisagez-vous pour votre trek sur place ?",
      hint: "Hors billet d'avion international et assurance voyage.",
      options: [
        { value: "1800_2200", label: "1 800 € à 2 200 € — trek optimisé, durée courte ou confort simple" },
        { value: "2200_2500", label: "2 200 € à 2 500 € — trek encadré avec itinéraire structuré" },
        { value: "2500_3000", label: "2 500 € à 3 000 € — trek plus complet, meilleur confort ou circuit plus long" },
        { value: "3000_plus", label: "Plus de 3 000 € — trek premium, long circuit ou extension îles" },
        { value: "conseil", label: "Je ne sais pas encore — je souhaite être conseillé" },
      ],
    },
    {
      kind: "radio",
      id: "km_par_jour",
      name: "kmParJour",
      question: "Combien de kilomètres par jour vous semblent réalistes ?",
      options: [
        { value: "5_8", label: "5 à 8 km par jour" },
        { value: "8_12", label: "8 à 12 km par jour" },
        { value: "12_18", label: "12 à 18 km par jour" },
        { value: "18_plus", label: "Plus de 18 km par jour" },
        { value: "autre", label: "Autre niveau — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "denivele",
      name: "denivele",
      question: "Quel dénivelé êtes-vous prêt à assumer ?",
      options: [
        { value: "faible", label: "Faible dénivelé, rythme tranquille" },
        { value: "modere", label: "Dénivelé modéré, quelques montées acceptées" },
        { value: "soutenu", label: "Dénivelé soutenu, effort physique assumé" },
        { value: "a_orienter", label: "Je ne sais pas, je veux être orienté selon mon niveau" },
        { value: "autre", label: "Autre précision — je détaille", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "terrain",
      name: "terrain",
      question: "Quel type de terrain vous attire ?",
      options: [
        { value: "accessible", label: "Sentiers accessibles et paysages variés" },
        { value: "rocheux", label: "Terrain rocheux ou minéral avec passages techniques modérés" },
        { value: "pistes", label: "Pistes, grands espaces, baobabs, sensation d'expédition encadrée" },
        { value: "jungle", label: "Jungle, humidité, végétation dense et ambiance sauvage" },
        { value: "autre", label: "Autre décor — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "passages_rocheux",
      name: "passagesRocheux",
      question: "Des passages rocheux type escalade légère ?",
      options: [
        { value: "aucun", label: "Non, je veux une randonnée classique sans passage technique" },
        { value: "faciles", label: "Oui, petits passages rocheux faciles uniquement" },
        { value: "engages", label: "Oui, passages plus engagés si encadrés et sécurisés" },
        { value: "a_conseiller", label: "Je ne sais pas, je veux être conseillé selon mon niveau" },
        { value: "autre", label: "Autre précision — je détaille", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "decor",
      name: "decor",
      question: "Quel grand décor vous fait rêver ?",
      options: [
        { value: "nord", label: "Nord : Diego, reliefs puissants, îles et extension Nosy Be possible" },
        { value: "ouest", label: "Ouest : baobabs, pistes, Morondava, grands espaces et aventure encadrée" },
        { value: "sud", label: "Sud / Sud-Ouest : Makay, canyons, zones arides, Tuléar et fin de parcours plage" },
        { value: "est", label: "Est : jungle, végétation dense, ambiance sauvage et Sainte-Marie" },
        { value: "a_orienter", label: "Je ne sais pas encore — je veux être orienté" },
      ],
    },
    {
      kind: "radio",
      id: "confort",
      name: "confort",
      question: "Quel niveau de confort attendez-vous le soir ?",
      options: [
        { value: "simple", label: "Simple : hébergements basiques mais organisés" },
        { value: "mixte", label: "Mixte : aventure la journée, repos correct le soir" },
        { value: "confort", label: "Confort : lodges ou hôtels agréables dès que possible" },
        { value: "rustique_ponctuel", label: "Rustique ponctuel accepté si l'expérience le justifie" },
        { value: "autre", label: "Autre attente — je précise", freeText: true },
      ],
    },
    {
      kind: "radio",
      id: "duree",
      name: "duree",
      question: "Combien de temps pour votre trek ?",
      options: [
        { value: "7_10", label: "7 à 10 jours" },
        { value: "10_15", label: "10 à 15 jours" },
        { value: "15_21", label: "15 à 21 jours" },
        { value: "21_plus", label: "Plus de 21 jours" },
        { value: "autre", label: "Autre durée — je précise", freeText: true },
      ],
    },
    {
      kind: "contact",
      id: "coordonnees",
      question: "Recevez votre itinéraire Trek Aventure",
      hint: "Réponse sous 24 h · proposition personnalisée · hors vol & assurance.",
      fields: ["periode", "nbVoyageurs", "commentaire"],
    },
  ],
};
