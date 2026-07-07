import type { FunnelConfig } from "@/types/funnel";
import {
  CVM_FINAL_CASES,
  CVM_STEP_PERIODE,
  CVM_STEP_VOYAGEURS,
} from "./cvm-commun";

/**
 * Funnel CVM · Expédition Explorer — gabarit maquette 2026-07-07 (4 étapes).
 * Règles de texte : jamais de devis ferme, pré-qualification (pas d'avis
 * médical), ne pas glorifier le danger. Les acceptations (certificat /
 * briefing) vivent sur l'écran coordonnées.
 */
export const cvmExplorerFunnel: FunnelConfig = {
  type: "cvm_explorer",
  brand: "cvm",
  label: "Expédition insolite & Missions humanitaires",
  intro: {
    titre: "Expédition insolite & Missions humanitaires",
    sousTitre:
      "Cette expédition n'est pas adaptée à tout le monde. Quatre réponses suffisent pour vérifier que l'expédition est faite pour vous.",
    note: "Participation soumise à validation physique, médicale et logistique. Certificat médical obligatoire. Prix hors billet d'avion et assurance.",
  },
  steps: [
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
      kind: "offer",
      id: "offre",
      question: "Quelle formule vous correspond ?",
      hint: "Prix indicatif par personne, hors vol international & assurance.",
    },
    CVM_STEP_PERIODE,
    CVM_STEP_VOYAGEURS,
  ],
  contact: {
    id: "coordonnees",
    variant: "cvm",
    cta: "Enregistrer mes coordonnées",
    question: "Vos coordonnées",
    message:
      "Cette demande ne confirme pas la participation. Elle permet de vérifier le profil, la motivation et les conditions nécessaires à une expédition sécurisée.",
    conditions: {
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
  },
  final: { cases: CVM_FINAL_CASES },
};
