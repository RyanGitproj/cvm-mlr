export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Coordonnées de contact affichées sur le site (PhoneLink / MailLink).
 * Tant qu'une valeur est `null`, le lien correspondant n'est pas rendu.
 */
export const contact = {
  telephone: "+33 6 87 22 47 70" as string | null,
  email: "reservation@celebrations-voyages.fr" as string | null,
};
