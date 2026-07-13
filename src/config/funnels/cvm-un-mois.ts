import type { FunnelConfig } from "@/types/funnel";
import {
  CVM_FINAL_CASES,
  CVM_STEP_PERIODE,
  CVM_STEP_VOYAGEURS,
} from "./cvm-commun";

/**
 * Funnel CVM · Grand Tour Madagascar — gabarit maquette 2026-07-07
 * (4 étapes). Nom d'usage : « Grand Tour », plus « un mois » (Ryan
 * 2026-07-07). Prudence obligatoire : admin/fiscal/juridique = orientation,
 * pas conseil.
 */
export const cvmUnMoisFunnel: FunnelConfig = {
  type: "cvm_un_mois",
  brand: "cvm",
  label: "Grand Tour Madagascar",
  intro: {
    titre: "Préparez votre Grand Tour de Madagascar",
    sousTitre:
      "Un mois pour comprendre l'île en profondeur. Répondez en moins d'une minute : vous recevez un pré-programme adapté, pas une offre générique.",
    note: "Les sujets administratifs, fiscaux, juridiques, résidence ou société doivent être confirmés auprès de professionnels compétents. Le programme peut orienter, mais ne remplace pas un conseil spécialisé.",
  },
  steps: [
    {
      kind: "radio",
      id: "objectif_mois",
      name: "objectifMois",
      question: "Quel est l'objectif de votre Grand Tour ?",
      options: [
        { value: "decouverte", label: "Découverte approfondie du pays et immersion culturelle" },
        { value: "expatriation", label: "Projet d'expatriation ou changement de vie" },
        { value: "creation_societe", label: "Création de société, investissement ou activité professionnelle" },
        { value: "retraite", label: "Retraite, long séjour ou résidence partielle" },
        {
          value: "autre",
          label: "Autre projet — je précise",
          freeText: true,
          image: {
            label: "Autre projet",
            alt: "Carte de voyage et épingle de destination sur fond orange, pour préciser votre projet",
            src: "/images/cvm/un-mois/autre-projet.png",
          },
        },
      ],
    },
    {
      kind: "offer",
      id: "offre",
      question: "Votre Grand Tour",
      hint: "Formule unique : prix indicatif par personne, hors vol international & assurance.",
    },
    CVM_STEP_PERIODE,
    CVM_STEP_VOYAGEURS,
  ],
  contact: {
    cta: "Recevoir ma proposition",
    hint: "Réponse sous 24 h · pré-programme personnalisé · hors vol & assurance.",
  },
  final: { cases: CVM_FINAL_CASES },
};
