export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Coordonnées de contact affichées sur le site (PhoneLink / MailLink).
 * Tant qu'une valeur est `null`, le lien correspondant n'est pas rendu.
 */
export const contact = {
  telephone: null as string | null, // [À COMPLÉTER PAR RYAN] ex. "+261 34 00 000 00"
  email: null as string | null, // [À COMPLÉTER PAR RYAN] ex. "contact@exemple.com"
};
