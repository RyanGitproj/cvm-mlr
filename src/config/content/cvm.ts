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
  /** Photo de fond du hero (`public/images/...`) — placeholder tant qu'absente. */
  heroSrc?: string;
  /** Vignettes « En images » — placeholder tant que `src` est absent. */
  galerie: { label: string; alt: string; src?: string }[];
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
    surtitre: "Trek Aventure",
    titre: "L'aventure encadrée, à votre niveau",
    sousTitre:
      "Vivez l'aventure sans partir à l'aveugle : un trek encadré, calibré sur votre niveau, vos paysages et votre rythme — en famille, en couple ou entre amis.",
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
      { duree: "10 jours", prixEuros: 2200 },
      { duree: "15 jours", prixEuros: 2500 },
    ],
    heroSrc: "/images/cvm/treks/hero-randonneurs-massif.jpg",
    // Libellés alignés sur les photos réelles fournies (décision Ryan
    // 2026-07-06) ; les slots sans photo gardent leur placeholder (TODO.md).
    galerie: [
      { label: "Crêtes au couchant", alt: "Randonneurs progressant sur une crête au coucher du soleil", src: "/images/cvm/treks/crete-coucher-soleil.jpg" },
      { label: "Canyons du Makay", alt: "Marcheurs dans un canyon du massif du Makay", src: "/images/cvm/treks/canyons-makay.jpg" },
      { label: "Allée des baobabs", alt: "Allée des baobabs près de Morondava au coucher du soleil" },
      { label: "L'aventure en famille", alt: "Famille progressant dans un lit de rivière de sable", src: "/images/cvm/treks/aventure-en-famille.jpg" },
      { label: "Campement d'étape", alt: "Tentes du campement dressées sur le sable au pied des reliefs", src: "/images/cvm/treks/campement-etape.jpg" },
      { label: "Plage de fin de parcours", alt: "Plage du Sud-Ouest malgache en fin de trek" },
    ],
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
      "Plus qu'un voyage : l'Expédition insolite vous emmène vers un Madagascar profond, exigeant et humain.",
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
    heroSrc: "/images/cvm/explorer/hero-sommet-euphorique.jpg",
    // Libellés alignés sur les photos réelles fournies (décision Ryan 2026-07-06).
    galerie: [
      { label: "Bivouac au feu de camp", alt: "Bivouac d'expédition autour d'un feu de camp", src: "/images/cvm/explorer/bivouac-feu-de-camp.jpg" },
      { label: "Guides & lecture du terrain", alt: "Guide local indiquant la direction dans la savane", src: "/images/cvm/explorer/guide-lecture-terrain.jpg" },
      { label: "Traversée aride", alt: "Marcheurs dans un canyon aride du Sud malgache", src: "/images/cvm/explorer/traversee-canyon-aride.jpg" },
      { label: "Marche de nuit à la frontale", alt: "Progression nocturne à la lampe frontale", src: "/images/cvm/explorer/marche-nocturne-frontale.jpg" },
      { label: "Rencontre villageoise", alt: "Échange avec les enfants d'un village isolé", src: "/images/cvm/explorer/rencontre-villageoise.jpg" },
      { label: "Zone humide dense", alt: "Progression le long d'une rivière ferrugineuse bordée de pandanus", src: "/images/cvm/explorer/riviere-rouge-pandanus.jpg" },
    ],
  },
  iles: {
    slug: "iles",
    funnelType: "cvm_iles",
    accent: "lagon",
    surtitre: "Séjour Collection Plages de rêves & îles paradisiaques",
    titre: "Madagascar côté rêve",
    sousTitre:
      "Plages paradisiaques, lagons et îles de rêve : Nosy Be, Sainte-Marie ou séjour combiné — composé sur votre ambiance, du romantique à la lune de miel.",
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
  },
  "un-mois": {
    slug: "un-mois",
    funnelType: "cvm_un_mois",
    surtitre: "Grand Tour Madagascar",
    // Positionnement brochure 2026-07 (p.4-5) : immersion culturelle,
    // paysages variés, découverte complète — culture et repos.
    titre: "Un mois pour comprendre l'île en profondeur",
    sousTitre:
      "Environ un mois à travers les grandes régions : immersion culturelle, paysages variés, découverte complète — avec le temps de s'imprégner et de se reposer.",
    ctaLabel: "Recevoir le programme Grand Tour Madagascar",
    micro: [
      "Réponse sous 24 h",
      "Pré-programme personnalisé",
      "Hors vol & assurance",
    ],
    presentation: [
      "Lagons turquoise, forêts tropicales, baobabs, Hautes Terres : Madagascar réunit des mondes d'une exceptionnelle diversité. Le Grand Tour les relie en un seul voyage — pour comprendre l'île en profondeur.",
      "Le rythme est posé : effort modéré, confort soigné, et l'alternance entre découverte, rencontres et repos. On ne coche pas des étapes — on s'imprègne de la culture, des régions et du quotidien malgache.",
      "Chaque itinéraire est 100 % sur-mesure : un conseiller construit votre mois idéal selon vos envies, votre rythme et votre budget.",
    ],
    inclus: [
      { titre: "Équipe locale engagée", texte: "Des experts passionnés, à vos côtés avant, pendant et après le voyage." },
      { titre: "Accueil aéroport aller / retour", texte: "Prise en charge à l'arrivée et assistance jusqu'au départ." },
      { titre: "Guides locaux", texte: "Des accompagnateurs qualifiés pour une immersion authentique." },
      { titre: "Hébergements sélectionnés", texte: "Des partenaires de confiance sur tout le parcours." },
      { titre: "Logistique maîtrisée", texte: "Transferts et déplacements organisés de bout en bout." },
      { titre: "Assistance locale", texte: "Une équipe joignable sur place pendant tout le séjour." },
    ],
    specifique: {
      titre: "Les grandes régions du Grand Tour",
      sousTitre: "Un mois pour relier les mondes de l'île-continent.",
      cartes: [
        { titre: "Hautes Terres & Antananarivo", texte: "Culture, artisanat, villages accueillants et reliefs majestueux." },
        { titre: "Le Nord", texte: "Nosy Be, plages de rêve, îles idylliques et parfums d'ailleurs." },
        { titre: "L'Est", texte: "Forêts luxuriantes, route des Pangalanes et Sainte-Marie." },
        { titre: "L'Ouest & le Sud", texte: "Baobabs, Tsingy, terres rouges et paysages minéraux grandioses." },
      ],
    },
    formules: [
      // Grand Tour Madagascar : formule unique, environ 1 mois (capture + brochure).
      { duree: "Environ 1 mois", prixEuros: 5300 },
    ],
    heroSrc: "/images/cvm/un-mois/hero-village-rencontre.jpg",
    // Libellés alignés sur les photos réelles fournies (décision Ryan 2026-07-06).
    galerie: [
      { label: "Hautes Terres & rizières", alt: "Rizières en terrasses des Hautes Terres malgaches" },
      { label: "Immersion urbaine", alt: "Rue animée d'une ville malgache", src: "/images/cvm/un-mois/rue-ville-malgache.jpg" },
      { label: "Allée des baobabs", alt: "Allée des baobabs dans l'Ouest de Madagascar" },
      { label: "Tsingy de l'Ouest", alt: "Randonneurs au cœur des formations minérales des Tsingy", src: "/images/cvm/un-mois/tsingy-ouest.jpg" },
      { label: "Canal des Pangalanes", alt: "Pirogue sur le canal des Pangalanes, côte Est" },
      { label: "Plages du Nord", alt: "Plage bordée d'eaux turquoise dans le Nord de Madagascar" },
    ],
  },
};

/**
 * Landing /cvm : présentation des 4 expériences + orientation.
 * Baseline et réassurance issues de la brochure Célébrations Voyages
 * (« Madagascar autrement », « Là où les autres ne vont pas », page 3).
 */
export const CVM_LANDING = {
  hero: {
    surtitre: "Célébrations Voyages Madagascar",
    // L'exclusivité en titre (« autrement » reste la signature MLR).
    titre: "Madagascar, là où les autres ne vont pas",
    sousTitre:
      "Quatre expériences encadrées par une équipe locale : l'expédition insolite, le trek aventure, le séjour à deux ou le grand tour d'un mois. Vous gardez l'émotion — nous gérons toute la logistique.",
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
