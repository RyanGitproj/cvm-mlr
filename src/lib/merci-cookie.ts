import { cookies } from "next/headers";
import { FUNNEL_TYPES, type FunnelType } from "@/types/lead";

const COOKIE_NAME = "merci";
const MAX_AGE_SECONDS = 30 * 60;

/**
 * Contenu du cookie post-soumission (brief §4.4) : uniquement de quoi
 * personnaliser la page merci — jamais de données sensibles.
 */
export type MerciData = {
  prenom: string;
  funnelType: FunnelType;
  /** Libellé de recommandation affichable (segmentation), si le funnel en produit une. */
  recommandation?: string;
  /** Lien vers l'univers recommandé (funnel orientation). */
  recommandationHref?: string;
};

export async function setMerciCookie(data: MerciData): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/merci",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readMerciCookie(): Promise<MerciData | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (raw === undefined) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    const funnelValide = (FUNNEL_TYPES as readonly string[]).includes(
      typeof candidate.funnelType === "string" ? candidate.funnelType : "",
    );
    if (typeof candidate.prenom !== "string" || !funnelValide) return null;
    return parsed as MerciData;
  } catch {
    return null;
  }
}
