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
    nom: "Render Services, Inc.",
    adresse: "525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis",
  },
  // Contact pour l'exercice des droits RGPD. Pas de DPO désigné : l'adresse de
  // contact commerciale (config/site.ts) fait office de point de contact.
  dpoEmail: "reservation@celebrations-voyages.fr",
  dureeConservation:
    "Les données des prospects sont conservées pendant une durée maximale de " +
    "3 ans à compter de leur collecte ou du dernier contact émanant du " +
    "prospect ; au-delà, elles sont supprimées ou anonymisées, sauf obligation " +
    "légale contraire. Pour les clients, les données peuvent être conservées " +
    "pendant la durée de la relation commerciale, puis jusqu'à 3 ans après sa " +
    "fin pour les actions commerciales.",
};
