import {
  visitorProfileSchema,
  type VisitorProfile,
} from "@/lib/validations/visitorProfile";

// v5 : nouveaux choix de projet et ajout de l'échéance indicative.
const VERSION = 5 as const;
const STORAGE_KEY = "cvm-mlr:visitor-profile";

/**
 * Un mois évite de redemander l'identité à chaque visite tout en bornant la
 * conservation de ces informations personnelles sur l'appareil.
 */
export const VISITOR_PROFILE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredVisitorProfile = {
  v: typeof VERSION;
  savedAt: number;
  profile: VisitorProfile;
};

export function encodeVisitorProfile(
  profile: VisitorProfile,
  savedAt: number,
): string {
  const stored: StoredVisitorProfile = { v: VERSION, savedAt, profile };
  return JSON.stringify(stored);
}

/** Décode et revalide toujours les données issues du navigateur. */
export function decodeVisitorProfile(
  raw: string | null,
  now: number,
): VisitorProfile | null {
  if (raw === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const stored = parsed as Record<string, unknown>;
  if (stored.v !== VERSION || typeof stored.savedAt !== "number") return null;
  if (stored.savedAt > now || now - stored.savedAt > VISITOR_PROFILE_TTL_MS) {
    return null;
  }

  const profile = visitorProfileSchema.safeParse(stored.profile);
  return profile.success ? profile.data : null;
}

function localStore(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readVisitorProfile(now = Date.now()): VisitorProfile | null {
  const store = localStore();
  if (store === null) return null;

  try {
    const profile = decodeVisitorProfile(store.getItem(STORAGE_KEY), now);
    if (profile === null) store.removeItem(STORAGE_KEY);
    return profile;
  } catch {
    return null;
  }
}

export function saveVisitorProfile(
  profile: VisitorProfile,
  now = Date.now(),
): void {
  const store = localStore();
  if (store === null) return;

  try {
    store.setItem(STORAGE_KEY, encodeVisitorProfile(profile, now));
  } catch {
    // Le parcours continue si le stockage est refusé (navigation privée stricte).
  }
}
