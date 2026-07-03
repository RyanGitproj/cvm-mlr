import type { FunnelType } from "@/types/lead";

/**
 * Contenu éditorial des pages CVM (landing + 4 univers) — dérivé de la
 * mission Riane et de la brochure Célébrations Voyages. Compléter = éditer
 * cette config, jamais le code (brief §12).
 */

export type CvmUniversSlug = "explorer" | "treks" | "iles" | "un-mois";

/**
 * Formule tarifaire d'une offre — durée optionnelle (Grand Tour = formule
 * unique sans durée). Prix indicatif par personne, hors vol & assurance.
 * Source : grille tarifaire CVM fournie par Ryan (2026-07).
 */
export type CvmFormule = { duree?: string; prixEuros: number };

export type CvmUniversContent = {
  slug: CvmUniversSlug;
  funnelType: FunnelType;
  /** Surcharge d'accent du thème CVM (ember = Expédition, lagon = Séjour Collection). */
  accent?: "ember" | "lagon";
  surtitre: string;
  titre: string;
  sousTitre: string;
  ctaLabel: string;
  micro: string[];
  presentation: string[];
  inclus: { titre: string; texte: string }[];
  specifique: {
    titre: string;
    sousTitre?: string;
    cartes: { titre: string; texte: string }[];
    note?: string;
  };
  /** Formules et tarifs indicatifs affichés sur la présentation de l'offre. */
  formules: CvmFormule[];
  galerie: { label: string; alt: string }[];
  questionnaireHref: string;
};

export const ETAPES_ACCOMPAGNEMENT = [
  {
    titre: "Votre projet structuré",
    texte: "Vous répondez au questionnaire : budget, niveau, décors, confort.",
  },
  {
    titre: "Une proposition personnalisée",
    texte: "Un conseiller construit l'itinéraire et l'estimation adaptés à vos réponses.",
  },
  {
    titre: "Validation ensemble",
    texte: "Vous ajustez, puis vous validez — nous gérons toute la logistique.",
  },
] as const;

export const CVM_UNIVERS: Record<CvmUniversSlug, CvmUniversContent> = {
  treks: {
    slug: "treks",
    funnelType: "cvm_treks",
    surtitre: "Treck aventure FAMILY_Liberty",
    titre: "L'aventure encadrée, à votre niveau",
    sousTitre:
      "Vivez l'aventure à Madagascar sans partir à l'aveugle : un trek encadré et convivial — en famille, en couple ou entre amis — selon votre niveau, vos paysages et votre rythme.",
    ctaLabel: "Recevoir mon itinéraire Trek Aventure",
    micro: [
      "Réponse sous 24 h",
      "Proposition personnalisée",
      "Hors vol & assurance",
    ],
    presentation: [
      "Madagascar se mérite à pied. Crêtes du Nord, pistes de l'Ouest entre les baobabs, canyons du Makay, jungle dense de l'Est : chaque région offre un décor de trek radicalement différent, loin des circuits classiques.",
      "Vous marchez, nous gérons le reste : guide local, itinéraire calibré sur votre niveau réel, transferts, hébergements choisis pour récupérer correctement chaque soir.",
      "C'est l'intensité maîtrisée, jamais l'expédition brute. Vous choisissez le rythme, le dénivelé et le confort — nous construisons le trek qui vous ressemble.",
    ],
    inclus: [
      { titre: "Guide local privé", texte: "Un accompagnateur qui connaît le terrain et ses habitants." },
      { titre: "Itinéraire préparé", texte: "Des étapes calibrées sur votre niveau et vos envies." },
      { titre: "Transferts organisés", texte: "Liaisons et logistique gérées de bout en bout." },
      { titre: "Hébergements sélectionnés", texte: "Du simple organisé au lodge confortable, selon formule." },
      { titre: "Repas selon formule", texte: "Une pension adaptée au programme de marche." },
      { titre: "Assistance locale", texte: "Une équipe joignable sur place pendant tout le trek." },
    ],
    specifique: {
      titre: "Choisissez votre décor",
      sousTitre: "Quatre régions, quatre ambiances — avec leurs repères de niveau.",
      cartes: [
        { titre: "Nord", texte: "Diego, reliefs puissants, extension Nosy Be possible. Niveau modéré à soutenu." },
        { titre: "Ouest", texte: "Baobabs, pistes, Morondava, grands espaces. Niveau accessible à modéré." },
        { titre: "Sud / Sud-Ouest", texte: "Makay, canyons, zones arides, fin de parcours plage vers Tuléar. Niveau soutenu." },
        { titre: "Est", texte: "Jungle, végétation dense, ambiance sauvage et Sainte-Marie. Niveau modéré, humidité." },
      ],
    },
    formules: [
      { duree: "7 jours", prixEuros: 2000 },
      { duree: "10 jours", prixEuros: 2200 },
      { duree: "15 jours", prixEuros: 2500 },
    ],
    galerie: [
      { label: "Crêtes du Nord — randonneurs", alt: "Randonneurs sur les reliefs du Nord de Madagascar" },
      { label: "Canyons du Makay", alt: "Canyons du massif du Makay" },
      { label: "Allée des baobabs", alt: "Allée des baobabs près de Morondava au coucher du soleil" },
      { label: "Jungle de l'Est", alt: "Sentier dans la végétation dense de l'Est malgache" },
      { label: "Camp du soir", alt: "Campement de trek au crépuscule" },
      { label: "Plage de fin de parcours", alt: "Plage du Sud-Ouest malgache en fin de trek" },
    ],
    questionnaireHref: "/cvm/treks/questionnaire",
  },
  explorer: {
    slug: "explorer",
    funnelType: "cvm_explorer",
    accent: "ember",
    surtitre: "Expédition insolite & Missions humanitaires",
    titre: "Madagascar profond, là où les circuits classiques ne vont pas",
    sousTitre:
      "Une expédition réelle, engagée et encadrée, pour les voyageurs prêts à vivre l'effort, le bivouac, l'immersion humaine et l'exploration terrain.",
    ctaLabel: "Voir si je suis compatible",
    micro: [
      "Certificat médical obligatoire",
      "Pré-validation humaine",
      "Hors vol & assurance",
    ],
    presentation: [
      "Vous cherchez plus qu'un voyage ? L'Expédition insolite vous emmène vers un Madagascar profond, exigeant et humain, loin des circuits touristiques classiques.",
      "Bivouac permanent — deux nuits d'hôtel seulement —, 15 à 25 km par jour selon profil, terrains difficiles : cette aventure se prépare sérieusement, avec une équipe qui encadre chaque étape.",
      "Cette expédition n'est pas adaptée à tout le monde, et c'est volontaire. Le questionnaire sert à vérifier ensemble, honnêtement, que l'expérience est faite pour vous.",
    ],
    inclus: [
      { titre: "Encadrement terrain", texte: "Guides et responsables terrain expérimentés à chaque étape." },
      { titre: "Logistique bivouac complète", texte: "Campements, ravitaillement et organisation quotidienne." },
      { titre: "Briefing sécurité", texte: "Cadre, consignes et préparation avant l'engagement." },
      { titre: "Liste matériel détaillée", texte: "Équipement requis et conseils d'achat si besoin." },
      { titre: "Immersion humaine validée localement", texte: "Rencontres et actions cadrées avec les partenaires locaux." },
      { titre: "Communication terrain", texte: "GPS, cartes et liaison satellite sur les zones isolées." },
    ],
    specifique: {
      titre: "Sécurité & certificat médical",
      sousTitre: "La vérité de l'expédition, posée avant l'engagement.",
      cartes: [
        { titre: "Certificat médical obligatoire", texte: "Aucune participation sans validation médicale récente." },
        { titre: "Bivouac permanent", texte: "Deux nuits en hôtel seulement — le reste sur le terrain." },
        { titre: "15 à 25 km par jour", texte: "Selon profil validé, sur terrain difficile et varié." },
        { titre: "Discipline collective", texte: "Consignes des guides et itinéraire ajustable selon les conditions." },
      ],
      note: "Jamais de devis ferme à ce stade : votre demande est une pré-validation, suivie d'un échange humain.",
    },
    formules: [
      { duree: "12 jours", prixEuros: 2800 },
      { duree: "15 jours", prixEuros: 3000 },
    ],
    galerie: [
      { label: "Bivouac au feu de camp", alt: "Bivouac d'expédition autour d'un feu de camp" },
      { label: "Guides & carte terrain", alt: "Guides préparant l'itinéraire sur carte" },
      { label: "Traversée aride", alt: "Marcheurs en zone semi-aride du Sud malgache" },
      { label: "Matériel d'expédition", alt: "Sac, lampe frontale et GPS d'expédition" },
      { label: "Rencontre villageoise", alt: "Échange avec des habitants d'un village isolé" },
      { label: "Zone humide dense", alt: "Progression en forêt humide dense" },
    ],
    questionnaireHref: "/cvm/explorer/questionnaire",
  },
  iles: {
    slug: "iles",
    funnelType: "cvm_iles",
    accent: "lagon",
    surtitre: "Séjour Collection Plages de rêves & îles paradisiaques",
    titre: "Madagascar côté rêve",
    sousTitre:
      "Plages paradisiaques, lagons et îles de rêve : séjours romantiques, lune de miel ou détente à deux — Nosy Be, Sainte-Marie ou séjour combiné, composé sur votre ambiance.",
    ctaLabel: "Créer mon Séjour Collection",
    micro: [
      "Réponse sous 24 h",
      "Proposition personnalisée",
      "Hors vol & assurance",
    ],
    presentation: [
      "Lagons turquoise, sable clair, couchers de soleil sur l'océan Indien : les îles malgaches offrent un décor balnéaire encore préservé, loin des plages standardisées.",
      "Nosy Be et ses îles pour le confort balnéaire, Sainte-Marie pour l'exotisme sauvage et l'histoire, ou un combiné circuit + île pour équilibrer découverte et repos.",
      "Vous rêvez, nous composons : hébergement, activités douces, rythme du séjour — une proposition construite sur votre ambiance, pas un package standard.",
    ],
    inclus: [
      { titre: "Hébergements sélectionnés", texte: "Du charme simple au premium, alignés sur votre budget." },
      { titre: "Activités douces", texte: "Spa, snorkeling, plongée encadrée, excursions en bateau." },
      { titre: "Transferts organisés", texte: "Liaisons île-continent et déplacements gérés." },
      { titre: "Conseil de saison", texte: "La bonne île au bon moment, selon la météo et votre budget." },
      { titre: "Rythme sur mesure", texte: "Du repos maximum au séjour actif mais confortable." },
      { titre: "Assistance locale", texte: "Une équipe joignable sur place pendant le séjour." },
    ],
    specifique: {
      titre: "Trois façons de vivre les îles",
      cartes: [
        { titre: "Nosy Be & ses îles", texte: "Lagons, excursions, plages et confort balnéaire." },
        { titre: "Sainte-Marie", texte: "Plus sauvage, exotique, historique — l'ancien repaire des pirates." },
        { titre: "Combiné circuit + île", texte: "Découverte encadrée du pays, puis repos les pieds dans l'eau." },
      ],
    },
    formules: [
      { duree: "10 jours", prixEuros: 2200 },
      { duree: "15 jours", prixEuros: 2500 },
    ],
    galerie: [
      { label: "Lagon de Nosy Be", alt: "Lagon turquoise de Nosy Be" },
      { label: "Plage de Sainte-Marie", alt: "Plage bordée de cocotiers à Sainte-Marie" },
      { label: "Snorkeling", alt: "Snorkeling dans les eaux claires malgaches" },
      { label: "Détente au spa", alt: "Moment de détente et de bien-être en bord de mer" },
      { label: "Excursion en bateau", alt: "Bateau d'excursion entre les îles" },
      { label: "Coucher de soleil", alt: "Coucher de soleil sur l'océan Indien" },
    ],
    questionnaireHref: "/cvm/iles/questionnaire",
  },
  "un-mois": {
    slug: "un-mois",
    funnelType: "cvm_un_mois",
    surtitre: "Grand Tour Madagascar",
    titre: "Et si Madagascar devenait plus qu'une destination ?",
    sousTitre:
      "Un mois sur place pour comprendre le pays, ses régions, son rythme de vie et ses opportunités avant de vous projeter.",
    ctaLabel: "Recevoir le programme Grand Tour Madagascar",
    micro: [
      "Réponse sous 24 h",
      "Pré-programme personnalisé",
      "Hors vol & assurance",
    ],
    presentation: [
      "Expatriation, création d'activité, retraite ou découverte approfondie : un mois d'immersion change la perspective — on ne visite plus, on se projette.",
      "Le programme s'adapte à la maturité de votre projet : première réflexion, comparaison sérieuse, repérage structuré ou déplacement déjà engagé.",
      "Sur les sujets administratifs, fiscaux ou juridiques, le programme oriente et met en relation — il ne remplace jamais un conseil spécialisé.",
    ],
    inclus: [
      { titre: "Programme d'immersion structuré", texte: "Un mois organisé autour de vos priorités réelles." },
      { titre: "Repérages par région", texte: "Villes, quartiers, cadre de vie et déplacements planifiés." },
      { titre: "Mises en relation locales", texte: "Contacts et partenaires selon votre projet." },
      { titre: "Accompagnement modulable", texte: "Du très accompagné à l'autonome avec points de contact." },
      { titre: "Hébergements longue durée", texte: "Des solutions adaptées à un séjour d'un mois." },
      { titre: "Orientation projet", texte: "Cadrage honnête — orientation, jamais conseil spécialisé." },
    ],
    specifique: {
      titre: "Les régions de votre repérage",
      cartes: [
        { titre: "Antananarivo & Hautes Terres", texte: "Centres économiques, quotidien urbain, opportunités." },
        { titre: "Le Nord", texte: "Diego, Nosy Be, littoral et potentiel touristique." },
        { titre: "L'Est", texte: "Sainte-Marie, nature, littoral, ambiance sauvage." },
        { titre: "L'Ouest / Sud", texte: "Morondava, Tuléar, grands espaces et potentiel régional." },
      ],
      note: "Sujets administratifs, fiscaux, juridiques, résidence ou société : orientation uniquement — à confirmer auprès de professionnels compétents.",
    },
    formules: [
      // Grand Tour Madagascar : formule unique, environ 1 mois (capture + brochure).
      { duree: "Environ 1 mois", prixEuros: 5300 },
    ],
    galerie: [
      { label: "Terrasse de travail", alt: "Espace de travail avec vue sur Antananarivo" },
      { label: "Hautes Terres", alt: "Paysage des Hautes Terres malgaches" },
      { label: "Rencontre locale", alt: "Discussion avec des partenaires locaux" },
      { label: "Marché de quartier", alt: "Marché local dans une ville malgache" },
      { label: "Littoral Est", alt: "Côte Est de Madagascar" },
      { label: "Vie de quartier", alt: "Rue vivante d'un quartier résidentiel" },
    ],
    questionnaireHref: "/cvm/un-mois/questionnaire",
  },
};

/**
 * Landing /cvm : présentation des 4 expériences + orientation.
 * Baseline et réassurance issues de la brochure Célébrations Voyages
 * (« Madagascar autrement », « Là où les autres ne vont pas », page 3).
 */
export const CVM_LANDING = {
  hero: {
    surtitre: "Célébration Voyage Madagascar",
    titre: "Madagascar autrement",
    sousTitre:
      "Là où les autres ne vont pas. Quatre expériences encadrées par une équipe locale : l'expédition, le trek en famille, le séjour à deux ou le grand tour d'un mois. Vous gardez l'émotion, nous gérons la logistique.",
    imageLabel: "Collage des 4 univers CVM",
    imageAlt: "Collage des quatre expériences : bivouac, trek, plage et projet de vie",
  },
  orientation: {
    titre: "Vous ne savez pas laquelle choisir ?",
    texte:
      "Répondez à quelques questions : budget, envie, niveau, confort — et recevez la recommandation la plus adaptée à votre profil.",
    cta: "Trouver mon expérience",
    href: "/cvm/orientation/questionnaire",
  },
  reassurance: [
    {
      titre: "Équipe locale engagée",
      texte: "Des experts passionnés, à vos côtés avant, pendant et après le voyage.",
    },
    {
      titre: "Plus de 80 intervenants terrain",
      texte: "Un réseau de professionnels fiables pour sécurité, confort et réactivité.",
    },
    {
      titre: "Accueil aéroport aller / retour",
      texte: "Prise en charge à l'arrivée et assistance jusqu'à votre départ.",
    },
    {
      titre: "Équipements de sécurité",
      texte: "Starlink, GPS, radios, téléphone satellite selon les zones traversées.",
    },
  ],
} as const;
