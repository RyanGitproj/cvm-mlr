import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;
let warned = false;

/**
 * Client singleton avec garde d'environnement : si les variables Supabase
 * sont absentes (maquette, preview sans base), on log un warning une seule
 * fois et on renvoie null — jamais de crash silencieux.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (!warned) {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY absents — l'enregistrement des leads est désactivé.",
      );
      warned = true;
    }
    client = null;
    return client;
  }

  client = createClient(url, anonKey, { auth: { persistSession: false } });
  return client;
}
