import type { MlrRoute } from "@/config/funnels";

/**
 * Contenu éditorial MLR (landing + 2 pages de présentation de route) —
 * extrait fidèlement des brochures ROAD_TRIP_{NORD,OUEST} et des maquettes
 * boss 2026-07-07 (Sud et Est retirés du catalogue : « le sud en
 * taxi-brousse c'est pas possible »). Ces pages ne portent aucun formulaire :
 * elles intègrent le wizard avec la route pré-sélectionnée.
 */

export type MlrRouteContent = {
  slug: MlrRoute;
  titre: string;
  sousTitre: string;
  accroche: string[];
  tempsFortsTitre: string;
  tempsForts: { titre: string; texte?: string }[];
  faitPour: string[];
  ressentir: { titre: string; texte: string }[];
  deroule: { jours: string; titre: string; texte?: string }[];
  quinzeJours: { titre: string; texte: string }[];
  inclus: { titre: string; texte: string }[];
  aPrevoir: { titre: string; texte: string }[];
  budgetSurPlace: string;
  astuces: string[];
  faq: { question: string; reponse: string }[];
  ctaLabel: string;
  /**
   * Photo d'ambiance de la route — sert trois fois : miniature de carte sur
   * /mlr, fond du hero de /mlr/{route} et carte-option Q1 du wizard.
   * Placeholder tant que `src` absent.
   */
  imageAmbiance: { label: string; alt: string; src?: string };
};

export const MLR_TARIFS = {
  dixJours: "10 jours dès 1 400 € / pers",
  quinzeJours: "15 jours dès 1 800 € / pers",
  format: "Guide local privé + taxi-brousse",
  idealPour: "Voyageurs libres · Aventure roots · Immersion locale",
} as const;

const ASSISTANCE_COMMUNE = [
  { titre: "Guide local privé", texte: "Un guide expérimenté et francophone à vos côtés." },
  { titre: "Taxi-brousse", texte: "Transport local rustique, au plus près de la vie." },
  { titre: "Assistance 7j/7", texte: "Une équipe disponible avant, pendant et après le voyage." },
  { titre: "Budget libre sur place", texte: "Organisez vos dépenses selon vos envies." },
] as const;

export const MLR_ROUTES_CONTENT: Record<MlrRoute, MlrRouteContent> = {
  nord: {
    slug: "nord",
    titre: "Road Trip Nord",
    sousTitre: "Reliefs, baies, cascades et aventure du Nord.",
    accroche: [
      "Au Nord de Madagascar, la route serpente entre terre rouge et mer turquoise. Chaque virage ouvre une émotion nouvelle : la brise salée sur la peau, les panoramas à couper le souffle, les cascades cachées qui murmurent dans la jungle, les sourires des villages qui réchauffent le cœur.",
      "Ici, le temps ralentit, l'essentiel revient. Vous respirez, vous explorez, vous vibrez. Et vous repartez transformé, reconnecté à ce qui compte vraiment.",
    ],
    tempsFortsTitre: "5 incontournables du Nord",
    tempsForts: [
      { titre: "Diego et ses reliefs" },
      { titre: "Baie d'Émeraude" },
      { titre: "Cascade tropicale" },
      { titre: "Villages du Nord" },
      { titre: "Panoramas côtiers" },
    ],
    faitPour: [
      "Les voyageurs libres, curieux et amoureux de nature brute.",
      "Celles et ceux qui cherchent à s'émerveiller, à prendre leur temps, à marcher, à rencontrer et à contempler les plus beaux horizons marins et terrestres.",
      "Un road trip authentique, accessible, rythmé par la liberté et la simplicité.",
    ],
    ressentir: [
      { titre: "Horizon", texte: "Des paysages à perte de vue, où la mer et la terre se répondent à chaque instant." },
      { titre: "Rencontres", texte: "Des échanges vrais avec les villageois, entre sourires, partage et simplicité." },
      { titre: "Énergie du Nord", texte: "Une nature puissante et vivante qui ressource, émerveille et reconnecte." },
    ],
    deroule: [
      { jours: "J1-2", titre: "Arrivée dans le Nord et premiers panoramas" },
      { jours: "J3", titre: "Villages et vie locale" },
      { jours: "J4-5", titre: "Criques, baies et grand air" },
      { jours: "J6", titre: "Cascades et fraîcheur tropicale" },
      { jours: "J7-8", titre: "Marche et points de vue" },
      { jours: "J9-10", titre: "Dernière route et émotion finale" },
    ],
    quinzeJours: [
      { titre: "Plus de côte", texte: "Plus de plages sauvages, bains et couchers de soleil." },
      { titre: "Plus de marche", texte: "Randonnées plus longues, lieux plus secrets." },
      { titre: "Plus de villages", texte: "Plus d'échanges, plus d'histoires, plus d'authenticité." },
      { titre: "Plus de temps pour souffler", texte: "Pour profiter, ralentir, et savourer chaque instant." },
    ],
    inclus: [
      { titre: "Guide local privé", texte: "Un accompagnement passionné et francophone." },
      { titre: "Itinéraire préparé", texte: "Un parcours optimisé et flexible." },
      { titre: "Taxi-brousse prévus", texte: "Transports locaux organisés selon le programme." },
      { titre: "Assistance 7j/7", texte: "Une équipe réactive à tout moment." },
      { titre: "Visites prévues", texte: "Sites et activités mentionnés au programme." },
      { titre: "Guides locaux selon les sites", texte: "Interventions locales pour mieux comprendre." },
      { titre: "Repas pendant campement", texte: "Tous les repas inclus durant les nuits en campement." },
    ],
    aPrevoir: [
      { titre: "Hôtels hors campement", texte: "Nuits en ville ou en bord de mer selon vos envies." },
      { titre: "Restaurants hors campement", texte: "Repas dans les villes et pauses hors campement." },
      { titre: "Vols internationaux et domestiques", texte: "Aller / retour et éventuels vols intérieurs." },
      { titre: "Assurances voyage", texte: "Assurance santé, rapatriement, annulation (recommandé)." },
      { titre: "Visa et formalités", texte: "Visa à votre charge selon votre nationalité." },
      { titre: "Dépenses personnelles", texte: "Souvenirs, pourboires, boissons, extras, etc." },
    ],
    budgetSurPlace:
      "Budget conseillé sur place : 45 à 75 € / jour — selon votre rythme, vos envies et vos choix de confort.",
    astuces: [
      "Soleil : crème, chapeau et lunettes indispensables.",
      "Eau : buvez de l'eau scellée uniquement.",
      "Protection : vêtements légers et couvrants.",
      "Argent : prévoyez du liquide en Ariary.",
      "Prudence : soyez vigilant le soir.",
      "Restaurants : demandez conseil au guide, il connaît les meilleures adresses.",
    ],
    faq: [
      { question: "Est-ce une aventure accessible ?", reponse: "Oui, le voyage est modulable selon votre rythme et vos envies." },
      { question: "Que comprend le tarif du road trip ?", reponse: "Guide local privé + taxi-brousse ; hôtels et restaurants (hors campement) à votre charge." },
      { question: "Quel budget prévoir sur place ?", reponse: "Budget conseillé : 45 à 75 € / jour selon vos choix de confort et d'activités." },
      { question: "Pour qui est ce voyage ?", reponse: "Pour les voyageurs libres, curieux et amoureux de paysages forts et d'expériences authentiques." },
      { question: "Puis-je adapter la durée ?", reponse: "Oui, le programme est flexible : 10 jours, 15 jours ou plus selon vos envies." },
      { question: "Comment réserver ?", reponse: "Contactez-nous pour recevoir votre road book Nord et valider ensemble votre aventure." },
    ],
    ctaLabel: "Recevoir mon road book Nord",
    imageAmbiance: { label: "Cascades du Nord", alt: "Cascade au cœur des reliefs verts de Madagascar", src: "/images/mlr/cascade-nord.jpg" },
  },
  ouest: {
    slug: "ouest",
    titre: "Road Trip Ouest",
    sousTitre: "Baobabs, pistes, villages isolés et grands espaces.",
    accroche: [
      "Ici, le silence a une voix. L'horizon s'étire à perte de vue, les baobabs millénaires veillent sur la terre rouge, les pistes nous mènent là où le temps ralentit.",
      "Au fil des villages et des rencontres vraies, on se reconnecte à l'essentiel. On respire plus profondément, on voit plus loin, on revient différent. Ce n'est pas qu'un voyage. C'est une transformation intérieure.",
    ],
    tempsFortsTitre: "Les temps forts du voyage",
    tempsForts: [
      { titre: "Allées de baobabs", texte: "Des paysages emblématiques où le temps suspend son vol." },
      { titre: "Pistes de l'Ouest", texte: "Des pistes sauvages, des décors bruts et une aventure à chaque virage." },
      { titre: "Villages isolés", texte: "Des rencontres vraies, des sourires simples, une immersion authentique." },
      { titre: "Lumières du couchant", texte: "Des couchers de soleil inoubliables qui embrasent l'Ouest malgache." },
      { titre: "Grande marche", texte: "Des treks accessibles pour se dépasser et se reconnecter à l'essentiel." },
    ],
    faitPour: [
      "Les voyageurs libres, curieux et indépendants.",
      "Les amateurs de grands espaces et de nature brute.",
      "Ceux qui cherchent une aventure ouverte et sans contraintes.",
      "Les amoureux d'authenticité et de contemplation.",
    ],
    ressentir: [
      { titre: "Immensité", texte: "Des horizons sans fin, où la nature dicte le rythme." },
      { titre: "Liberté", texte: "Pistes sauvages, rencontres vraies et choix d'itinéraire sur mesure." },
      { titre: "Transformation", texte: "Se reconnecter à l'essentiel, revenir différent, plus vivant." },
    ],
    deroule: [
      { jours: "J1-2", titre: "Mise en route vers l'Ouest" },
      { jours: "J3", titre: "Découverte des premiers baobabs" },
      { jours: "J4-5", titre: "Villages reculés et pistes" },
      { jours: "J6", titre: "Grands espaces et respiration" },
      { jours: "J7-8", titre: "Marches, poussière et liberté" },
      { jours: "J9-10", titre: "Derniers panoramas et émotion de clôture" },
    ],
    quinzeJours: [
      { titre: "Plus d'immersion", texte: "Rencontres plus profondes, temps partagé." },
      { titre: "Plus de pistes", texte: "Itinéraires plus sauvages, accès à des zones reculées." },
      { titre: "Plus de contemplation", texte: "Rythme plus doux, pour goûter chaque instant." },
      { titre: "Plus de temps hors des sentiers", texte: "Pour vivre l'inattendu et l'authenticité." },
    ],
    inclus: [
      { titre: "Guide local privé", texte: "Un accompagnement bienveillant et francophone tout au long du voyage." },
      { titre: "Itinéraire préparé", texte: "Un parcours pensé pour l'Ouest, souple et adapté au terrain." },
      { titre: "Taxi-brousse prévus", texte: "Transports locaux prévus et organisés selon les étapes." },
      { titre: "Assistance 7j/7", texte: "Une équipe disponible à tout moment." },
      { titre: "Visites prévues", texte: "Rencontres, sites naturels et visites selon le programme." },
      { titre: "Guides locaux selon sites", texte: "Interventions de guides spécialistes selon les lieux." },
      { titre: "Repas pendant campement", texte: "Repas préparés pendant les étapes en campement (petit-déj, déjeuner, dîner)." },
    ],
    aPrevoir: [
      { titre: "Hôtels hors campement", texte: "Nuits en hôtels ou lodges en dehors des campements." },
      { titre: "Restaurants hors campement", texte: "Repas pris au restaurant en dehors des campements." },
      { titre: "Vols", texte: "Vols internationaux et vols domestiques." },
      { titre: "Assurances", texte: "Assurance voyage, santé ou rapatriement." },
      { titre: "Visa", texte: "Frais de visa et formalités." },
      { titre: "Dépenses personnelles", texte: "Achats personnels, souvenirs, boissons hors campement, pourboires, etc." },
    ],
    budgetSurPlace:
      "Budget conseillé sur place : 45 à 75 € / jour — pour couvrir vos dépenses personnelles non incluses, selon votre rythme et vos envies.",
    astuces: [
      "Soleil : protégez-vous (chapeau, lunettes, crème).",
      "Eau : buvez uniquement de l'eau scellée.",
      "Argent liquide : prévoyez des Ariary en espèces.",
      "Vêtements sobres : respectez les coutumes locales.",
      "Suivre le guide : ses conseils assurent votre sécurité et enrichissent votre expérience.",
      "Sorties tardives à éviter : pour votre sécurité.",
      "Équipements simples mais utiles : lampe frontale, batterie externe, répulsif, trousse perso.",
    ],
    faq: [
      { question: "Quel est le niveau ?", reponse: "Niveau modéré. Marches accessibles à tous avec de bonnes chaussures." },
      { question: "Que comprend le budget ?", reponse: "Le guide privé, le taxi-brousse, l'itinéraire et l'assistance. Hôtels et restaurants hors campement à votre charge." },
      { question: "Quel budget prévoir ?", reponse: "Budget conseillé : 45 à 75 € par jour selon vos choix." },
      { question: "À qui s'adresse ce voyage ?", reponse: "Aux voyageurs libres qui aiment l'aventure ouverte, les rencontres sincères et les grands horizons." },
    ],
    ctaLabel: "Recevoir mon road book Ouest",
    imageAmbiance: { label: "Allée des baobabs au couchant", alt: "Marcheurs dans l'allée des baobabs sous la lumière du soir", src: "/images/mlr/allee-baobabs-couchant.jpg" },
  },
};

/** Bandeau de services commun aux routes (bas de brochure). */
export const MLR_SERVICES = ASSISTANCE_COMMUNE;

const [guideLocal, taxiBrousse, assistance] = ASSISTANCE_COMMUNE;

/**
 * Bandeau services de la landing /mlr (écran 2/8 des maquettes) : le repas
 * de campement remplace « budget libre » — l'info budget est déjà portée
 * par la note tarifaire affichée juste au-dessus. Inclusion validée par
 * les fiches devis officielles (docs/utils/2.jpeg SUD, 4.jpeg EST).
 */
export const MLR_SERVICES_LANDING = [
  guideLocal,
  taxiBrousse,
  {
    titre: "Repas campement inclus",
    texte: "Cuisine locale autour du feu, lors des nuits en campement.",
  },
  assistance,
] as const;

/** Note d'exclusion affichée sous chaque prix (maquette 3 du 2026-07-07). */
export const MLR_DUREES_NOTE = "Hors vols, hôtels et restaurants.";

/** Landing /mlr — hero et wording des maquettes boss 2026-07-07 (tutoiement). */
export const MLR_LANDING = {
  hero: {
    surtitre: "Madagascar Liberty Roots",
    titre: "Madagascar ne se visite pas. Elle se traverse.",
    sousTitre:
      "Découvre la route qui te correspond : Nord ou Ouest, 10 ou 15 jours, avec un guide local à tes côtés.",
    badges: ["Petit groupe", "Guide local", "Liberté", "Sécurité"],
    // Image actuelle (triptyque) — le studio livrera le visuel maquette
    // (taxi-brousse mythique sur la piste des baobabs), voir TODO.md.
    imageLabel: "Triptyque ambiance roots",
    imageAlt: "Triptyque roots : tuk-tuk à Majunga, immersion en ville, taxi-brousse chargé",
  },
  durees: [
    {
      value: "10_jours",
      titre: "10 jours — Taxi-brousse intégral",
      prix: "dès 1 400 € / pers",
      prixDes: 1400,
      texte: "Le plus brut. Le plus local. Le plus proche des Malgaches.",
      cta: "Je veux le vrai road trip",
      icon: "bus",
      image: {
        label: "Taxi-brousse intégral",
        alt: "Taxi-brousse chargé de bagages sur la piste rouge, voyageurs sac au dos",
        src: "/images/mlr/taxi-brousse-piste-rouge.jpg",
      },
    },
    {
      // Retour en 4x4 officialisé par la maquette 3 du boss (2026-07-07) —
      // le taxi-brousse reste le véhicule d'identité de la marque.
      value: "15_jours",
      titre: "15 jours — Immersion + retour 4x4",
      prix: "dès 1 800 € / pers",
      prixDes: 1800,
      texte: "Tu ressens la vraie route, puis tu récupères avec plus de confort.",
      cta: "Je veux l'aventure avec plus de confort",
      icon: "jeep",
      image: {
        label: "Immersion + retour 4x4",
        alt: "Voyageurs près d'un 4x4 face aux grands espaces de l'Ouest au couchant",
      },
    },
  ],
  routes: [
    {
      slug: "nord",
      titre: "Le Nord",
      texte: "Forêts, mer, villages, pistes et rencontres.",
      cta: "Je choisis le Nord",
    },
    {
      slug: "ouest",
      titre: "L'Ouest",
      texte: "Baobabs, pistes rouges, grands espaces et couchers de soleil.",
      cta: "Je choisis l'Ouest",
    },
  ],
} as const;
