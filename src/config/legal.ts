/**
 * Données de la société éditrice (source : user_identity.md) — consommées
 * par les pages légales, jamais en dur dans le JSX.
 *
 * CVM et MLR sont deux marques de la même société : une seule entité
 * juridique, ne pas en inventer une seconde.
 */
export const legal = {
  // Dénomination juridique — réservée aux mentions légales (« Éditeur du
  // site »), obligation réglementaire : ne pas remplacer par le nom commercial.
  raisonSociale: "LIEUX DE CELEBRATIONS.COM",
  // Nom commercial sous lequel la société opère les deux marques — utilisé pour
  // l'affichage grand public (copyright du footer), pas pour le registre légal.
  nomCommercial: "Célébrations Voyages",
  forme: "SAS",
  capital: "200 €",
  siege: "60 rue François Ier, 75008 Paris",
  siren: "990 106 098",
  siret: "990 106 098 00017",
  rcs: "RCS Paris",
  tva: "FR20990106098",
  directeurPublication: "M. Ludwig Laurent Thomas, Président",
  hebergeur: {
    nom: "Render",
    adresse: "[À COMPLÉTER PAR RYAN — adresse légale de Render]",
  },
  dpoEmail: "[À COMPLÉTER PAR RYAN]",
  dureeConservation: "[À COMPLÉTER PAR RYAN]",
};
