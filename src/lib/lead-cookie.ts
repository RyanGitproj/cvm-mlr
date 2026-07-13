import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { FUNNEL_TYPES, type FunnelType } from "@/types/lead";

/**
 * Cookie du lead final — autorise l'enregistrement ultérieur du choix `suite`.
 * Signé HMAC-SHA256 : `httpOnly` protège de XSS, mais l'utilisateur maîtrise
 * ses cookies (devtools) — sans signature il pourrait viser l'id d'un autre
 * lead alors que la service_role bypasse la RLS.
 */

const COOKIE_NAME = "lead_session";
const MAX_AGE_SECONDS = 60 * 60; // 1 h

export type LeadSession = { id: string; funnelType: FunnelType };

function sign(payload: string): string {
  const secret = process.env.LEAD_COOKIE_SECRET ?? "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function setLeadCookie(session: LeadSession): Promise<void> {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const value = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readLeadCookie(): Promise<LeadSession | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (raw === undefined) return null;

  const sep = raw.lastIndexOf(".");
  if (sep <= 0) return null;
  const payload = raw.slice(0, sep);
  const signature = raw.slice(sep + 1);

  // Comparaison à temps constant (anti timing attack) ; longueurs d'abord.
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(sign(payload));
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (typeof parsed !== "object" || parsed === null) return null;
    const candidate = parsed as Record<string, unknown>;
    const funnelType = candidate.funnelType;
    const funnelValide =
      typeof funnelType === "string" &&
      (FUNNEL_TYPES as readonly string[]).includes(funnelType);
    if (typeof candidate.id !== "string" || !funnelValide) return null;
    return { id: candidate.id, funnelType: funnelType as FunnelType };
  } catch {
    return null;
  }
}
