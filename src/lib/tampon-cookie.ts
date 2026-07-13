import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Relie le premier formulaire au lead final sans exposer l'UUID dans le
 * navigateur. La signature empêche de remplacer l'id par celui d'un autre
 * visiteur alors que les écritures serveur utilisent la service_role.
 */
const COOKIE_NAME = "lead_tampon_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sign(payload: string): string {
  const secret = process.env.LEAD_COOKIE_SECRET ?? "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function setTamponCookie(id: string): Promise<void> {
  const payload = Buffer.from(JSON.stringify({ id })).toString("base64url");
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

export async function readTamponCookie(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (raw === undefined) return null;

  const separator = raw.lastIndexOf(".");
  if (separator <= 0) return null;
  const payload = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));

  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (typeof parsed !== "object" || parsed === null) return null;
    const id = (parsed as Record<string, unknown>).id;
    return typeof id === "string" && UUID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

export async function clearTamponCookie(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
