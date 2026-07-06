import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;
let warned = false;

/**
 * Client Supabase `service_role` — écritures serveur uniquement (Server Actions).
 *
 * La clé `service_role` bypasse la RLS : c'est la seule façon propre d'insérer
 * dans des tables en deny-all et de récupérer l'id via `.select()`. Elle ne doit
 * JAMAIS atteindre le navigateur — d'où `import "server-only"` (build error si
 * ce module est importé côté client) et une variable SANS préfixe NEXT_PUBLIC_.
 *
 * Même garde d'environnement que le client anon historique : si les variables
 * sont absentes (maquette, preview sans base), on log une fois et on renvoie
 * null — l'appelant dégrade proprement, jamais de crash.
 */
export function getServiceClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (!warned) {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY absents — l'enregistrement des leads est désactivé.",
      );
      warned = true;
    }
    client = null;
    return client;
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
