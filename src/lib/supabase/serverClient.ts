import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;
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

  // Nouvelles clés Supabase (2026) en priorité ; compatibilité conservée avec
  // les anciennes variables déjà utilisées par les déploiements existants.
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (!warned) {
      console.warn(
        "[supabase] SUPABASE_URL / SUPABASE_SECRET_KEY absents (ou anciennes variables NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — ajoutez-les dans .env.local puis redémarrez Next.js.",
      );
      warned = true;
    }
    // Ne pas mémoriser l'échec : en développement, Next.js peut recharger les
    // variables après une modification de `.env`. Le prochain appel retentera
    // alors la création du client sans nécessiter un nouveau build.
    return null;
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
