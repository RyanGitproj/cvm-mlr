import type { MlrRoute } from "@/config/funnels";

/**
 * Contenu éditorial MLR (landing + 4 pages de présentation de route) —
 * extrait fidèlement des brochures ROAD_TRIP_{SUD,NORD,EST,OUEST} et des
 * one-pagers. Ces pages ne portent aucun formulaire : elles lancent le
 * questionnaire unique avec la route pré-sélectionnée (?route=).
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
  devis?: {
    titre: string;
    lignes: { prestation: string; montant: string }[];
    total: string;
    note: string;
  };
  deroule: { jours: string; titre: string; texte?: string }[];
  quinzeJours: { titre: string; texte: string }[];
  inclus: { titre: string; texte: string }[];
  aPrevoir: { titre: string; texte: string }[];
  budgetSurPlace: string;
  astuces: string[];
  faq: { question: string; reponse: string }[];
  temoignage?: { texte: string; auteur: string };
  ctaLabel: string;
  imageAmbiance: { label: string; alt: string };
};

export const MLR_TARIFS = {
  dixJours: "10 jours dès 1 442 € / pers",
  quinzeJours: "15 jours dès 1 855 € / pers",
  format: "Guide local privé + taxi-brousse",
  idealPour: "Voyageurs libres · Aventure roots · Immersion locale",
} as const;

export const MLR_STAMP = "Exemple de devis — non nominatif";

const ASSISTANCE_COMMUNE = [
  { titre: "Guide local privé", texte: "Un guide expérimenté et francophone à vos côtés." },
  { titre: "Taxi-brousse", texte: "Transport local rustique, au plus près de la vie." },
  { titre: "Assistance 7j/7", texte: "Une équipe disponible avant, pendant et après le voyage." },
  { titre: "Budget libre sur place", texte: "Organisez vos dépenses selon vos envies." },
] as const;

export const MLR_ROUTES_CONTENT: Record<MlrRoute, MlrRouteContent> = {
  sud: {
    slug: "sud",
    titre: "Road Trip Sud",
    sousTitre: "Pistes rouges, canyons, villages et aventure locale.",
    accroche: [
      "Laissez la route vous guider. Entre pistes rouges, canyons majestueux et villages authentiques, ce voyage vous reconnecte à l'essentiel : à vous-même, aux autres, à la liberté.",
      "Ici, le temps ralentit, l'air est plus pur, les rencontres sont vraies. Un souffle d'espace, une aventure humaine, un dépassement de soi tout en douceur.",
    ],
    tempsFortsTitre: "5 temps forts du voyage",
    tempsForts: [
      { titre: "Pistes rouges", texte: "Des routes mythiques au cœur de la brousse et des grands espaces." },
      { titre: "Villages & marchés", texte: "Rencontres sincères, artisanat, saveurs locales et vie de village." },
      { titre: "Canyons & massifs", texte: "Formations spectaculaires, falaises, gorges et canyons à couper le souffle." },
      { titre: "Rencontres locales", texte: "Échanges authentiques avec les habitants, partages et générosité." },
      { titre: "Couchers de soleil du Sud", texte: "Des fins de journée inoubliables, entre lumière chaude et silence." },
    ],
    faitPour: [
      "Voyageurs libres — en quête d'aventure, d'espace et de liberté.",
      "Amateurs d'immersion — qui aiment aller à la rencontre des cultures locales.",
      "Profils curieux — passionnés de nature, de paysages et d'authenticité.",
      "Envie de déconnexion et de dépassement — pour se recentrer, se dépasser et revenir transformé.",
    ],
    ressentir: [
      { titre: "Reconnexion", texte: "Ralentir, se recentrer, respirer. Retrouver l'essentiel au rythme des paysages." },
      { titre: "Immersion locale", texte: "Partager le quotidien des habitants, découvrir des savoir-faire et des moments vrais." },
      { titre: "Dépassement de soi", texte: "Sortir de sa zone de confort, marcher, s'émerveiller et grandir à chaque étape." },
    ],
    devis: {
      titre: "Road Trip Sud — 10 jours / 9 nuits",
      lignes: [
        { prestation: "Accompagnement par guide local privé francophone", montant: "650 €" },
        { prestation: "Préparation de l'itinéraire & logistique", montant: "200 €" },
        { prestation: "Transports en taxi-brousse (trajets prévus)", montant: "310 €" },
        { prestation: "Nuits en campement (sous tente) × 7", montant: "350 €" },
        { prestation: "Visites & entrées sur les sites prévus", montant: "120 €" },
        { prestation: "Assistance 7j/7 pendant le voyage", montant: "60 €" },
        { prestation: "Guides locaux selon sites & activités", montant: "150 €" },
        { prestation: "Repas pendant les phases de campement", montant: "280 €" },
      ],
      total: "2 120 €",
      note: "Estimation indicative pour 2 personnes. Devis personnalisé selon la saison, le nombre de voyageurs et vos préférences.",
    },
    deroule: [
      { jours: "J1-2", titre: "Hauts plateaux et mise en route", texte: "Prise en main, premiers paysages, adaptation en douceur." },
      { jours: "J3", titre: "Villages et route locale", texte: "Pistes rouges, rencontres et première immersion." },
      { jours: "J4-5", titre: "Immersion canyons et paysages minéraux", texte: "Exploration de canyons spectaculaires et terres minérales." },
      { jours: "J6-7", titre: "Rencontres, marche, panoramas", texte: "Randonnées, points de vue, échanges humains forts." },
      { jours: "J8", titre: "Route vers le Sud profond", texte: "Cap vers les terres plus sauvages et reculées." },
      { jours: "J9-10", titre: "Émotion de clôture", texte: "Derniers instants, gratitude et retour." },
    ],
    quinzeJours: [
      { titre: "Plus de temps", texte: "Pour savourer chaque étape sans se presser." },
      { titre: "Plus de marche", texte: "Itinéraires de randonnée plus variés et engagés." },
      { titre: "Plus de rencontres", texte: "Temps prolongé avec les communautés locales." },
      { titre: "Plus de villages reclus", texte: "Accès à des lieux encore plus authentiques." },
    ],
    inclus: [
      { titre: "Guide local privé", texte: "Accompagnement par un guide local francophone dédié." },
      { titre: "Itinéraire préparé", texte: "Un parcours pensé pour découvrir l'essentiel du Sud, hors des sentiers battus." },
      { titre: "Taxi-brousse prévus", texte: "Tous les trajets prévus en taxi-brousse locale, inclus." },
      { titre: "Visites prévues", texte: "Sites incontournables et expériences authentiques incluses." },
      { titre: "Assistance 7j/7", texte: "Une équipe disponible chaque jour pendant votre voyage." },
      { titre: "Guides locaux selon les sites", texte: "Interventions de guides locaux spécialisés selon les lieux." },
      { titre: "Repas pendant les campements", texte: "Tous les repas inclus lors des nuits en campement." },
    ],
    aPrevoir: [
      { titre: "Hôtels hors campement", texte: "Les nuits en hôtels ou chez l'habitant hors campement." },
      { titre: "Restaurants hors campement", texte: "Les repas pris en ville ou dans les restaurants." },
      { titre: "Vols", texte: "Les vols internationaux et/ou intérieurs jusqu'à Madagascar." },
      { titre: "Assurances", texte: "Assurance voyage, santé, rapatriement (fortement conseillé)." },
      { titre: "Visa", texte: "Frais de visa à l'arrivée ou en ligne selon votre nationalité." },
      { titre: "Dépenses personnelles", texte: "Boissons, souvenirs, pourboires et dépenses personnelles." },
    ],
    budgetSurPlace:
      "Budget conseillé sur place : 45 à 75 € / jour — pour vos repas hors campement, boissons, petits achats, pourboires et imprévus.",
    astuces: [
      "Buvez uniquement de l'eau en bouteille scellée.",
      "Prévoyez des pièces en petites coupures, bien réparties.",
      "Habillez-vous simplement et sobrement.",
      "Suivez les recommandations du guide, il connaît le terrain.",
      "Ne sortez pas seul tard le soir.",
      "Privilégiez toujours les restaurants recommandés.",
    ],
    faq: [
      { question: "Quel niveau physique faut-il ?", reponse: "Voyage accessible à tous avec un peu de marche." },
      { question: "Le voyage inclut-il tous les repas ?", reponse: "Non, uniquement les repas pendant les nuits en campement." },
      { question: "Quel budget prévoir par jour ?", reponse: "Entre 45 et 75 € / jour selon votre style de voyage." },
      { question: "À qui s'adresse ce voyage ?", reponse: "Aux voyageurs libres, curieux, ouverts et amoureux d'authenticité." },
      { question: "Peut-on adapter le programme ?", reponse: "Oui, selon vos envies, la saison et vos contraintes." },
      { question: "Comment réserver ?", reponse: "Demandez votre devis personnalisé, sans engagement." },
    ],
    temoignage: {
      texte:
        "Ce road trip nous a reconnectés à l'essentiel. Des paysages à couper le souffle, des rencontres vraies, et une organisation au top. On se sent libres, en confiance, et profondément enrichis.",
      auteur: "Charlotte & Julien, voyageurs en août 2024",
    },
    ctaLabel: "Recevoir mon road book Sud",
    imageAmbiance: { label: "Pistes rouges du Sud", alt: "Piste de terre rouge et 4×4 dans le Sud malgache" },
  },
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
    imageAmbiance: { label: "Baie d'Émeraude", alt: "Baie turquoise et reliefs du Nord de Madagascar" },
  },
  est: {
    slug: "est",
    titre: "Road Trip Est",
    sousTitre: "Forêt tropicale, lémuriens, sentiers et immersion verte.",
    accroche: [
      "Respirez l'humidité douce de la forêt. Écoutez le chant des oiseaux, le cri lointain des lémuriens. Laissez le temps ralentir, le cœur s'ouvrir, l'esprit s'apaiser.",
      "Ici, la nature est reine et l'authenticité une évidence. Un voyage pour vous reconnecter à l'essentiel, vous calmer, et vous ouvrir aux autres… et à vous-même.",
    ],
    tempsFortsTitre: "5 temps forts de votre Road Trip Est",
    tempsForts: [
      { titre: "Forêt tropicale", texte: "Marchez au cœur d'une nature luxuriante, préservée et pleine de vie." },
      { titre: "Lémuriens", texte: "Observez ces animaux uniques dans leur habitat naturel." },
      { titre: "Sentiers verts", texte: "Parcourez des chemins sauvages, entre forêts, rizières et rivières." },
      { titre: "Villages de l'Est", texte: "Plongez dans la culture locale et partagez des instants sincères." },
      { titre: "Panoramas & eau", texte: "Cascades, rivières et paysages à couper le souffle." },
    ],
    faitPour: [
      "Les voyageurs sensibles à la nature.",
      "Ceux en quête de douceur et de calme.",
      "Les amoureux d'immersion locale.",
      "Ceux qui recherchent des rencontres vraies.",
    ],
    ressentir: [
      { titre: "Nature vivante", texte: "Une connexion profonde avec la forêt, les animaux et les éléments." },
      { titre: "Rencontres vraies", texte: "Des échanges sincères avec des habitants accueillants." },
      { titre: "Apaisement intérieur", texte: "Un rythme doux pour se recentrer et retrouver l'essentiel." },
    ],
    devis: {
      titre: "Road Trip Est — exemple de devis (base 2 personnes)",
      lignes: [
        { prestation: "Guide privé francophone (10 jours)", montant: "650 €" },
        { prestation: "Itinéraire et organisation complète", montant: "250 €" },
        { prestation: "Transports taxi-brousse (estimation)", montant: "450 €" },
        { prestation: "Guides locaux selon sites", montant: "120 €" },
        { prestation: "Visites et entrées prévues", montant: "120 €" },
        { prestation: "Repas pendant campement (estimation)", montant: "180 €" },
        { prestation: "Assistance 7j/7", montant: "Incluse" },
      ],
      total: "1 800 € (hors vols & hébergements)",
      note: "Tarifs indicatifs à la date d'édition du devis. Variables selon la saison, le nombre de voyageurs et les disponibilités.",
    },
    deroule: [
      { jours: "J1-2", titre: "Entrée dans l'Est et premières forêts", texte: "Arrivée, installation, découverte des premiers sentiers verdoyants." },
      { jours: "J3", titre: "Marche en pleine nature", texte: "Randonnée au cœur d'une nature luxuriante et préservée." },
      { jours: "J4-5", titre: "Lémuriens et immersion verte", texte: "Observation des lémuriens et exploration des forêts tropicales." },
      { jours: "J6", titre: "Villages et culture locale", texte: "Rencontres, partage et découverte des traditions locales." },
      { jours: "J7-8", titre: "Cascades, eau et respiration", texte: "Baignades, cascades, rivières et paysages d'exception." },
      { jours: "J9-10", titre: "Retour avec sensation de renaissance", texte: "Temps de retour, bilan et dernières découvertes mémorables." },
    ],
    quinzeJours: [
      { titre: "Plus de nature", texte: "Plus de forêts, de sentiers et de lieux préservés." },
      { titre: "Plus d'observation", texte: "Encore plus de temps pour observer la faune et la flore." },
      { titre: "Plus de lenteur", texte: "Un rythme encore plus doux pour intégrer chaque instant." },
      { titre: "Plus de rencontres", texte: "Plus d'échanges avec les habitants et les artisans locaux." },
    ],
    inclus: [
      { titre: "Guide privé", texte: "Un accompagnement bienveillant et expert tout au long du voyage." },
      { titre: "Itinéraire préparé", texte: "Un parcours optimisé, testé et ajustable selon vos envies." },
      { titre: "Taxi-brousse prévus", texte: "Transports locaux planifiés pour une immersion authentique." },
      { titre: "Assistance 7j/7", texte: "Nous sommes à chaque étape pour vous aider." },
      { titre: "Visites prévues", texte: "Sites, activités et temps forts sélectionnés pour vous." },
      { titre: "Guides locaux selon sites", texte: "Connaissance du terrain et partage culturel authentique." },
      { titre: "Repas pendant campement", texte: "Cuisine locale préparée avec soin lors des nuits en campement." },
    ],
    aPrevoir: [
      { titre: "Hôtels hors campement", texte: "Hébergements en hôtels ou lodges non inclus (nous conseillons)." },
      { titre: "Restaurants hors campement", texte: "Repas pris en ville ou en hébergement non inclus." },
      { titre: "Vols internationaux et domestiques", texte: "À la charge du voyageur." },
      { titre: "Assurances", texte: "Assurance voyage, santé et rapatriement non incluses." },
      { titre: "Visa et formalités", texte: "Frais de visa et démarches administratives à votre charge." },
      { titre: "Dépenses personnelles", texte: "Achats souvenirs, boissons, pourboires et extras personnels." },
    ],
    budgetSurPlace:
      "Budget conseillé sur place : 45 à 75 € / jour — hors hébergements et repas en ville. Ce budget couvre repas, snacks, boissons, petits transports, entrées de sites et extras.",
    astuces: [
      "Climat humide : attendez-vous à de la chaleur et de l'humidité.",
      "Chaussures adaptées : sentiers, boue et rivières.",
      "Vêtements légers et respirants, chapeau et protège-pluie utiles.",
      "Eau scellée recommandée, buvez régulièrement.",
      "Anti-moustiques indispensable, surtout en soirée.",
      "Respectez les conseils du guide et les consignes locales.",
      "Goûtez la cuisine locale et demandez nos restaurants recommandés !",
    ],
    faq: [
      { question: "Le devis est-il ferme ?", reponse: "Non, il est indicatif. Nous l'ajustons ensemble selon vos envies et la saison." },
      { question: "Peut-on personnaliser l'itinéraire ?", reponse: "Oui, tout est modulable selon vos centres d'intérêt et votre rythme." },
      { question: "Quel niveau de marche est nécessaire ?", reponse: "Accessible à tous. Des options plus sportives sont possibles." },
      { question: "Faut-il réserver longtemps à l'avance ?", reponse: "Oui, surtout en haute saison (mai à octobre)." },
      { question: "Comment se passe le paiement ?", reponse: "Acompte à la réservation, solde avant le départ." },
    ],
    ctaLabel: "Recevoir mon road book Est",
    imageAmbiance: { label: "Forêt tropicale de l'Est", alt: "Forêt tropicale dense de l'Est malgache" },
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
    imageAmbiance: { label: "Allée des baobabs au couchant", alt: "Allée des baobabs sous la lumière du soir dans l'Ouest malgache" },
  },
};

/** Bandeau de services commun aux 4 routes (bas de brochure). */
export const MLR_SERVICES = ASSISTANCE_COMMUNE;

/** Landing /mlr. */
export const MLR_LANDING = {
  hero: {
    surtitre: "Madagascar Liberty Roots",
    titre: "Road Trip Madagascar",
    // Signature dictée par le boss (2026-07) en tête de sous-titre.
    sousTitre:
      "La liberté de vivre simplement une expérience unique. Quatre roots, un guide local privé, le taxi-brousse — et votre liberté comme fil conducteur.",
    imageLabel: "Logo baobab + piste — ambiance affiche",
    imageAlt: "Baobab et piste de terre rouge, ambiance affiche vintage",
  },
  durees: [
    {
      titre: "10 jours",
      prix: "dès 1 442 € / pers",
      texte: "L'essentiel de la route, au rythme roots.",
    },
    {
      titre: "15 jours",
      prix: "dès 1 855 € / pers",
      texte: "Plus de temps, plus de rencontres, plus de pistes.",
    },
  ],
  routes: [
    { slug: "nord", titre: "Nord", texte: "Reliefs, baies turquoise, cascades." },
    { slug: "sud", titre: "Sud", texte: "Pistes rouges, canyons, villages." },
    { slug: "est", titre: "Est", texte: "Forêt tropicale, lémuriens, ambiance verte." },
    { slug: "ouest", titre: "Ouest", texte: "Baobabs, pistes, grands horizons." },
  ],
} as const;
