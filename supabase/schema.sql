-- Table unique des leads (brief §4.1) — à exécuter dans l'éditeur SQL Supabase.
-- funnel_type : 'cvm_orientation' | 'cvm_explorer' | 'cvm_treks' | 'cvm_iles'
--               | 'cvm_un_mois' | 'mlr'

create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  funnel_type     text not null,
  brand           text not null check (brand in ('cvm', 'mlr')),
  common_fields   jsonb not null,
  specific_fields jsonb not null,
  recommendation  jsonb,
  utm             jsonb,
  created_at      timestamptz not null default now()
);

-- RLS : le front n'a besoin que d'INSERT (rôle anon). Aucune lecture publique —
-- l'équipe aval lit via service key côté serveur (hors scope de ce projet).
alter table public.leads enable row level security;

create policy "anon peut insérer un lead"
  on public.leads
  for insert
  to anon
  with check (true);
