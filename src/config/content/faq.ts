/**
 * FAQ commune (brief §11.3) — questions issues des sources : mission Riane
 * (CVM) et brochures road trip (MLR). Deux colonnes, une par marque.
 */

export const FAQ_CVM = [
  {
    question: "Que comprennent les expériences Célébration Voyages ?",
    reponse:
      "Selon le programme : organisation, accompagnement, logistique locale, hébergements ou bivouacs, transports sur place, activités et partenaires terrain.",
  },
  {
    question: "Les vols internationaux sont-ils inclus ?",
    reponse:
      "Non. Votre enveloppe concerne l'expérience sur place à Madagascar : le billet d'avion international et l'assurance voyage restent à prévoir séparément.",
  },
  {
    question: "Quel budget prévoir ?",
    reponse:
      "Les enveloppes s'étendent de 1 800 € à plus de 3 000 € par personne sur place, selon l'expérience, la durée et le confort. C'est la première question de chaque questionnaire — pour vous répondre juste, dès le départ.",
  },
  {
    question: "Quel niveau physique faut-il ?",
    reponse:
      "Cela dépend de l'univers : le Séjour Collection est accessible à tous ; le Trek Aventure s'adapte à votre niveau réel (kilomètres par jour, dénivelé) ; l'Expédition insolite est exigeante — 15 à 25 km par jour et certificat médical obligatoire.",
  },
  {
    question: "Pourquoi un certificat médical pour l'Expédition insolite ?",
    reponse:
      "L'expédition implique un bivouac permanent, des terrains difficiles et de longues journées de marche. La participation est soumise à une validation physique, médicale et logistique — pour votre sécurité.",
  },
  {
    question: "Comment se construit la proposition ?",
    reponse:
      "Vous répondez au questionnaire de votre univers, un conseiller construit l'itinéraire et l'estimation adaptés, puis vous ajustez et validez ensemble.",
  },
] as const;

export const FAQ_MLR = [
  {
    question: "Quel niveau faut-il pour un road trip Liberty ?",
    reponse:
      "Niveau modéré : les marches sont accessibles à tous avec de bonnes chaussures, et le programme est modulable selon votre rythme.",
  },
  {
    question: "Que comprend le tarif du road trip ?",
    reponse:
      "Le guide local privé, l'itinéraire préparé, les trajets prévus en taxi-brousse, les visites prévues, l'assistance 7j/7 et les repas pendant les campements. Hôtels et restaurants hors campement restent à votre charge.",
  },
  {
    question: "Quel budget prévoir sur place ?",
    reponse:
      "Entre 45 et 75 € par jour selon votre style de voyage : repas hors campement, boissons, petits achats, pourboires et imprévus.",
  },
  {
    question: "Peut-on adapter le programme ?",
    reponse:
      "Oui, tout est modulable : 10 jours, 15 jours ou plus, selon vos envies, la saison et vos contraintes.",
  },
  {
    question: "Faut-il réserver longtemps à l'avance ?",
    reponse:
      "Oui, surtout en haute saison (mai à octobre). Demandez votre road book : le devis personnalisé est sans engagement.",
  },
  {
    question: "Comment se passe le paiement ?",
    reponse: "Acompte à la réservation, solde avant le départ.",
  },
] as const;
