import type { FunnelType } from "@/types/lead";
import type { VideoContent } from "@/config/content/video";

/**
 * Contenu éditorial des pages CVM (landing + 4 univers) — dérivé de la
 * mission Riane et de la brochure Célébrations Voyages. Compléter = éditer
 * cette config, jamais le code (brief §12).
 */

export type CvmUniversSlug = "explorer" | "treks" | "iles" | "un-mois";

/**
 * Formule tarifaire d'une offre — durée optionnelle (Grand Tour = formule
 * unique sans durée). Prix indicatif par personne, hors vol & assurance.
 * Source : grille tarifaire CVM fournie par Ryan (2026-07). La phrase
 * d'appui est propre à chaque aventure — créa validée par Ryan le
 * 2026-07-07, ancrée dans la brochure `Celebrations_Voyages_Madagascar.pdf`
 * (p.5 « Nos 4 univers »).
 */
export type CvmFormule = {
  /**
   * Clé stable de la formule — partagée entre l'UI (OfferCards), l'enum Zod
   * (`offreDuree`) et la colonne `offre_ref`. Absente = formule unique non
   * choisie (Grand Tour).
   */
  value?: string;
  duree?: string;
  prixEuros: number;
  /** Phrase d'appui de la carte d'offre (maquette 3). */
  texte?: string;
  /** Volet photo de la carte — photo d'ambiance réutilisée ou placeholder. */
  image?: { label: string; alt: string; src?: string };
};

export type CvmUniversContent = {
  slug: CvmUniversSlug;
  funnelType: FunnelType;
  /**
   * Couleur dominante de l'aventure (directive boss 2026-07-07) : rouge =
   * Expédition, vert = Trek, lagon = Îles (référence, inchangée), orange =
   * Grand Tour. Appliquée à la page, à son wizard et à sa card landing.
   */
  accent?: "rouge" | "vert" | "lagon" | "orange";
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
  /**
   * Card de la landing /cvm (maquette avant_vocale du 2026-07-07) : image
   * portrait fournie par le studio avec titre et badges incrustés, puis
   * 4 puces sous l'image — seuls textes portés par le code.
   */
  card: {
    image: { label: string; alt: string; src?: string };
    puces: readonly [string, string, string, string];
  };
  /** Section vidéo YouTube, sous la note tarifaire (facultative). */
  video?: VideoContent;
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
    texte: "Vous ajustez, puis vous validez : nous gérons toute la logistique.",
  },
] as const;

export const CVM_UNIVERS: Record<CvmUniversSlug, CvmUniversContent> = {
  treks: {
    slug: "treks",
    funnelType: "cvm_treks",
    accent: "vert",
    surtitre: "Trek Aventure",
    titre: "L'aventure encadrée, à votre niveau",
    sousTitre:
      "Un trek encadré, calibré sur votre niveau et votre rythme, en famille, en couple ou entre amis.",
    ctaLabel: "Préparer mon voyage",
    card: {
      // Visuel studio livré le 2026-07-07 (lot WhatsApp docs/, placement
      // validé par la capture de référence).
      image: {
        label: "Card Treks Aventure",
        alt: "Treks Aventure : randonneur au sommet des tsingy face aux massifs et à la forêt",
        src: "/images/cvm/cards/card-treks-aventure.jpg",
      },
      puces: [
        "Trekking sur circuits aménagés",
        "Paysages spectaculaires et rencontres locales",
        "Adapté à tous les niveaux",
        "Aventure et découverte garanties",
      ],
    },
    micro: [
      "Réponse sous 24 h",
      "Proposition personnalisée",
      "Hors vol & assurance",
    ],
    // Présentations condensées au maximum (demande Ryan 2026-07-07 soir).
    presentation: [
      "Crêtes du Nord, baobabs de l'Ouest, canyons du Makay, jungle de l'Est : vous marchez, nous gérons le reste. L'intensité maîtrisée, calibrée sur votre niveau réel, jamais l'expédition brute.",
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
      sousTitre: "Quatre régions, quatre ambiances, avec leurs repères de niveau.",
      cartes: [
        { titre: "Nord", texte: "Diego, reliefs puissants, extension Nosy Be possible. Niveau modéré à soutenu." },
        { titre: "Ouest", texte: "Baobabs, pistes, Morondava, grands espaces. Niveau accessible à modéré." },
        { titre: "Sud", texte: "Makay, canyons, zones arides, fin de parcours plage vers Tuléar. Niveau soutenu." },
        { titre: "Est", texte: "Jungle, végétation dense, ambiance sauvage et Sainte-Marie. Niveau modéré, humidité." },
      ],
    },
    formules: [
      {
        value: "10_jours",
        duree: "10 jours",
        prixEuros: 2200,
        texte:
          "Cascades, forêts et villages : l'aventure accessible, idéale pour une première immersion.",
        image: {
          label: "Forêts & rivière",
          alt: "Vue aérienne d'une rivière serpentant dans une forêt tropicale dense",
          src: "/images/cvm/treks/offre-10j-foret-riviere.png",
        },
      },
      {
        value: "15_jours",
        duree: "15 jours",
        prixEuros: 2500,
        texte:
          "Plus de paysages, plus de rencontres : le trek qui prend le temps d'aller plus loin.",
        image: {
          label: "Tsingy, pierres levées",
          alt: "Deux randonneurs surplombant le labyrinthe de pics calcaires des Tsingy",
          src: "/images/cvm/treks/offre-15j-tsingy.png",
        },
      },
    ],
    video: {
      youtubeId: "O6ALKgN-R80",
      titre: "Marchez avant même de partir",
      description:
        "Crêtes, canyons, forêts : parcourez du regard les décors qui vous attendent. Quelques minutes d'images, et le trek se vit déjà : vous savez s'il est fait pour vous.",
    },
    heroSrc: "/images/cvm/treks/hero-treks-cover.png",
    // Libellés alignés sur les photos réelles fournies (décision Ryan
    // 2026-07-06) ; les slots sans photo gardent leur placeholder (TODO.md).
    galerie: [
      { label: "Crêtes au couchant", alt: "Randonneurs progressant sur une crête au coucher du soleil", src: "/images/cvm/treks/crete-coucher-soleil.jpg" },
      { label: "Canyons du Makay", alt: "Marcheurs dans un canyon du massif du Makay", src: "/images/cvm/treks/canyons-makay.jpg" },
      { label: "Allée des baobabs", alt: "Allée des baobabs près de Morondava au coucher du soleil", src: "/images/cvm/treks/galerie-allee-baobabs.png" },
      { label: "L'aventure en famille", alt: "Famille progressant dans un lit de rivière de sable", src: "/images/cvm/treks/aventure-en-famille.jpg" },
      { label: "Campement d'étape", alt: "Tentes du campement dressées sur le sable au pied des reliefs", src: "/images/cvm/treks/campement-etape.jpg" },
      { label: "Plage de fin de parcours", alt: "Plage du Sud-Ouest malgache en fin de trek", src: "/images/cvm/treks/galerie-plage-fin-parcours.png" },
    ],
  },
  explorer: {
    slug: "explorer",
    funnelType: "cvm_explorer",
    accent: "rouge",
    surtitre: "Expédition insolite & Missions humanitaires",
    titre: "Madagascar profond, là où les circuits classiques ne vont pas",
    sousTitre:
      "Une expédition réelle, engagée et encadrée : l'effort, le bivouac, l'immersion humaine.",
    ctaLabel: "Préparer mon voyage",
    card: {
      image: {
        label: "Card Expédition Explorer",
        alt: "Expédition Explorer : cordée de randonneurs en zone extrême au couchant",
        src: "/images/cvm/cards/card-expedition-explorer.jpg",
      },
      puces: [
        "Zones extrêmes et inexplorées",
        "Cartographie, relevés GPS, données scientifiques",
        "Engagement physique et mental",
        "Encadré par des experts – Sécurité maîtrisée",
      ],
    },
    micro: [
      "Certificat médical obligatoire",
      "Pré-validation humaine",
      "Hors vol & assurance",
    ],
    presentation: [
      "Bivouac permanent, 15 à 25 km par jour, terrains difficiles : une vraie expédition encadrée, vers un Madagascar profond et humain. Elle n'est pas adaptée à tout le monde : le questionnaire vérifie honnêtement qu'elle est faite pour vous.",
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
        { titre: "Bivouac permanent", texte: "Deux nuits en hôtel seulement, le reste sur le terrain." },
        { titre: "15 à 25 km par jour", texte: "Selon profil validé, sur terrain difficile et varié." },
        { titre: "Discipline collective", texte: "Consignes des guides et itinéraire ajustable selon les conditions." },
      ],
      note: "Jamais de devis ferme à ce stade : votre demande est une pré-validation, suivie d'un échange humain.",
    },
    formules: [
      {
        value: "12_jours",
        duree: "12 jours",
        prixEuros: 2800,
        texte:
          "L'expédition pure : hors sentiers, bivouac permanent, immersion profonde.",
        image: {
          label: "Bivouac & repas partagé",
          alt: "Voyageurs et guides locaux partageant un repas au bivouac devant un massif rocheux",
          src: "/images/cvm/explorer/offre-12j-bivouac-repas.png",
        },
      },
      {
        value: "15_jours",
        duree: "15 jours",
        prixEuros: 3000,
        texte:
          "Trois jours plus loin dans l'isolement : l'expédition dans toute son intensité.",
        image: {
          label: "Rivière au fond du canyon",
          alt: "Marcheur longeant la rivière rouge au fond d'un canyon verdoyant",
          src: "/images/cvm/explorer/offre-15j-riviere-canyon.png",
        },
      },
    ],
    video: {
      youtubeId: "CYMS1pqalUI",
      titre: "L'expédition, sans filtre",
      description:
        "Le bivouac, l'effort, les zones que personne ne filme : voyez la réalité du terrain avant de vous engager. Ce que vous ressentez en regardant, c'est déjà votre réponse.",
    },
    heroSrc: "/images/cvm/explorer/hero-explorer-cover.png",
    // Libellés alignés sur les photos réelles fournies (décision Ryan 2026-07-06).
    galerie: [
      { label: "Pause sur la rivière", alt: "Groupe de randonneurs posés sur un tronc au-dessus d'une rivière de canyon", src: "/images/cvm/explorer/galerie-riviere-canyon.jpeg" },
      { label: "Guides & lecture du terrain", alt: "Guide local indiquant la direction dans la savane", src: "/images/cvm/explorer/guide-lecture-terrain.jpg" },
      { label: "Traversée aride", alt: "Marcheurs dans un canyon aride du Sud malgache", src: "/images/cvm/explorer/traversee-canyon-aride.jpg" },
      { label: "Marche vers le couchant", alt: "Cordée progressant vers le soleil couchant sur une crête herbeuse", src: "/images/cvm/explorer/galerie-marche-couchant.png" },
      { label: "Cap sur l'aventure", alt: "Main tenant une boussole face aux reliefs montagneux", src: "/images/cvm/explorer/galerie-boussole.jpg" },
      { label: "Carnet de nature", alt: "Pause d'observation : étude d'un herbier à la loupe", src: "/images/cvm/explorer/galerie-carnet-nature.jpg" },
    ],
  },
  iles: {
    slug: "iles",
    funnelType: "cvm_iles",
    accent: "lagon",
    surtitre: "Séjour Collection Plages de rêves & îles paradisiaques",
    titre: "Madagascar côté rêve",
    sousTitre:
      "Nosy Be, Sainte-Marie ou séjour combiné : plages, lagons et détente, composés sur votre ambiance.",
    ctaLabel: "Préparer mon voyage",
    card: {
      image: {
        label: "Card Plages de rêve",
        alt: "Plages de rêve et îles paradisiaques : hamac au-dessus d'un lagon turquoise bordé de palmiers",
        src: "/images/cvm/cards/card-plages-de-reve.jpg",
      },
      puces: [
        "Séjours bien-être en bord de mer",
        "Îles secrètes, lagons cristallins",
        "Hébergements de charme",
        "Déconnexion et ressourcement",
      ],
    },
    micro: [
      "Réponse sous 24 h",
      "Proposition personnalisée",
      "Hors vol & assurance",
    ],
    presentation: [
      "Nosy Be pour le confort balnéaire, Sainte-Marie pour l'exotisme sauvage, ou le combiné découverte + repos. Vous rêvez, nous composons : hébergement, activités douces et rythme, sur votre ambiance, jamais un package standard.",
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
        { titre: "Sainte-Marie", texte: "Plus sauvage, exotique, historique : l'ancien repaire des pirates." },
        { titre: "Combiné circuit + île", texte: "Découverte encadrée du pays, puis repos les pieds dans l'eau." },
      ],
    },
    formules: [
      {
        value: "10_jours",
        duree: "10 jours",
        prixEuros: 2200,
        texte:
          "Eaux cristallines, sable blanc, sérénité absolue : l'essentiel du rêve.",
        image: { label: "Lagon de Nosy Be", alt: "Lagon turquoise de Nosy Be", src: "/images/cvm/iles/lagon-nosy-be.png" },
      },
      {
        value: "15_jours",
        duree: "15 jours",
        prixEuros: 2500,
        texte:
          "Deux semaines de douceur : les îles, le lagon et le temps de tout savourer.",
        image: {
          label: "Sortie en pirogue",
          alt: "Sortie en pirogue avec un piroguier local sur le lagon turquoise",
          src: "/images/cvm/iles/offre-15j-pirogue-lagon.png",
        },
      },
    ],
    video: {
      youtubeId: "T_eWsHhgKKo",
      titre: "Le lagon vous appelle déjà",
      description:
        "Sable blanc, eau turquoise, temps suspendu : laissez ces images faire le travail. Vous y êtes presque, il ne reste qu'à composer votre séjour.",
    },
    heroSrc: "/images/cvm/iles/hero-iles-cover.png",
    galerie: [
      { label: "Lagon de Nosy Be", alt: "Lagon turquoise de Nosy Be", src: "/images/cvm/iles/lagon-nosy-be.png" },
      { label: "Plage de Sainte-Marie", alt: "Plage de Sainte-Marie et son canon historique face au lagon", src: "/images/cvm/iles/galerie-sainte-marie.png" },
      { label: "Snorkeling", alt: "Snorkeling dans les eaux claires malgaches", src: "/images/cvm/iles/galerie-snorkeling.png" },
      { label: "Détente au spa", alt: "Massage bien-être sous une paillote face au lagon turquoise", src: "/images/cvm/iles/galerie-spa.png" },
      { label: "Excursion en bateau", alt: "Bateau d'excursion entre les îles", src: "/images/cvm/iles/galerie-excursion-bateau.png" },
      { label: "Coucher de soleil", alt: "Pirogue à balancier et couple sur la plage au coucher du soleil, baobabs en silhouette", src: "/images/cvm/iles/galerie-coucher-soleil.png" },
    ],
  },
  "un-mois": {
    slug: "un-mois",
    funnelType: "cvm_un_mois",
    accent: "orange",
    surtitre: "Grand Tour Madagascar",
    // Positionnement brochure 2026-07 (p.4-5) : immersion culturelle,
    // paysages variés, découverte complète — culture et repos.
    titre: "Un mois pour comprendre l'île en profondeur",
    sousTitre:
      "Environ un mois à travers les grandes régions : immersion culturelle, découverte complète, repos.",
    ctaLabel: "Préparer mon voyage",
    card: {
      image: {
        label: "Card Grand Mada Tour",
        alt: "Grand Tour Madagascar : 4x4 chargé traversant l'allée des baobabs dans la lumière dorée",
        src: "/images/cvm/cards/card-grand-mada-tour.jpg",
      },
      puces: [
        "Itinéraire touristique – Sans hors-piste",
        "Découverte des incontournables",
        "Confort et liberté en 4x4",
        "Un mois d'immersion en toute autonomie",
      ],
    },
    micro: [
      "Réponse sous 24 h",
      "Pré-programme personnalisé",
      "Hors vol & assurance",
    ],
    presentation: [
      "Lagons, forêts, baobabs, Hautes Terres : le Grand Tour relie les mondes de l'île en un seul voyage, pour la comprendre en profondeur. Rythme posé, confort soigné, itinéraire 100 % sur-mesure, selon vos envies et votre budget.",
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
      {
        value: "un_mois",
        duree: "Environ 1 mois",
        prixEuros: 5300,
        texte:
          "Un mois pour relier les mondes de l'île : culture, paysages et repos.",
        image: {
          label: "Tsingy de l'Ouest",
          alt: "Randonneurs au cœur des formations minérales des Tsingy",
          src: "/images/cvm/un-mois/tsingy-ouest.jpg",
        },
      },
    ],
    video: {
      youtubeId: "f-9nb4Zf6NM",
      titre: "Un mois d'île, en aperçu",
      description:
        "Hautes Terres, baobabs, lagons : découvrez en images l'ampleur du Grand Tour. Tout un pays défile, et l'envie de le vivre en entier s'impose d'elle-même.",
    },
    heroSrc: "/images/cvm/un-mois/hero-un-mois-cover.png",
    // Libellés alignés sur les photos réelles fournies (décision Ryan 2026-07-06).
    galerie: [
      { label: "Hautes Terres & rizières", alt: "Rizières en terrasses des Hautes Terres malgaches", src: "/images/cvm/un-mois/galerie-hautes-terres-rizieres.jpg" },
      { label: "Antananarivo, la capitale", alt: "Vue aérienne du Rova d'Antananarivo dominant la capitale et son lac", src: "/images/cvm/un-mois/galerie-antananarivo.png" },
      { label: "Allée des baobabs", alt: "Allée des baobabs dans l'Ouest de Madagascar", src: "/images/cvm/un-mois/galerie-allee-baobabs.jpg" },
      { label: "Tsingy de l'Ouest", alt: "Randonneurs au cœur des formations minérales des Tsingy", src: "/images/cvm/un-mois/tsingy-ouest.jpg" },
      { label: "Canal des Pangalanes", alt: "Pirogue sur le canal des Pangalanes, côte Est", src: "/images/cvm/un-mois/galerie-canal-pangalanes.png" },
      { label: "Plages du Nord", alt: "Plage bordée d'eaux turquoise dans le Nord de Madagascar", src: "/images/cvm/un-mois/galerie-plages-nord.png" },
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
      "Quatre expériences encadrées par une équipe locale. Vous gardez l'émotion, nous gérons toute la logistique.",
    imageLabel: "Grand paysage CVM au couchant",
    imageAlt: "4x4 chargé sur une piste côtière au coucher du soleil, massif rocheux et baie turquoise en arrière-plan",
  },
  orientation: {
    // CTA masqués (décision Ryan 2026-07-13 : plus d'orientation) — repasser
    // à true pour réafficher les deux CTA de la landing /cvm tels quels
    // (bouton Hero + bandeau). Le formulaire, lui, reste fonctionnel en URL
    // directe.
    actif: false,
    titre: "Vous ne savez pas laquelle choisir ?",
    texte:
      "Répondez à quelques questions sur votre envie, votre niveau et votre confort, et recevez la recommandation la plus adaptée à votre profil.",
    cta: "Trouver mon expérience",
    href: "/cvm/orientation/questionnaire",
  },
  video: {
    youtubeId: "NnmBDtqwbrE",
    titre: "Regardez Madagascar prendre vie",
    description:
      "Quelques minutes d'images, et vous y êtes déjà. Ce que nos voyageurs vivent sur place, vous le ressentez avant même de choisir votre expérience.",
  } satisfies VideoContent,
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
