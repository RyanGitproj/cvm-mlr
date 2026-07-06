-- Schéma des leads — parcours 2 étapes / 2 tables relationnelles.
-- À exécuter dans l'éditeur SQL Supabase.
--
-- Sécurité : RLS activée SANS aucune policy → deny-all pour anon ET
-- authenticated. Toutes les écritures passent par le client `service_role`
-- côté serveur (Server Actions), qui bypasse la RLS. La clé `service_role` ne
-- vit jamais dans le bundle navigateur (variable SANS préfixe NEXT_PUBLIC_).
-- Le navigateur ne parle jamais à Supabase directement : la clé anon n'est
-- plus utilisée par l'application.

-- ─────────────────────────────────────────────────────────────────────────────
-- Table 1 — funnel_cvm_mlr_info : coordonnées + choix d'offre + attribution
-- (colonnes indépendantes). Écrite en une fois à la fin de l'étape 1 (le lead
-- n'est jamais perdu).
-- ─────────────────────────────────────────────────────────────────────────────
create table public.funnel_cvm_mlr_info (
  id                    uuid primary key default gen_random_uuid(),

  -- Contexte
  funnel_type           text not null check (funnel_type in (
                          'cvm_orientation', 'cvm_explorer', 'cvm_treks',
                          'cvm_iles', 'cvm_un_mois', 'mlr')),
  brand                 text not null check (brand in ('cvm', 'mlr')),

  -- Contact (composant commun)
  nom                   text not null,
  prenom                text,
  telephone             text not null,
  email                 text not null,
  nb_voyageurs          smallint check (nb_voyageurs between 1 and 20),
  periode               text,
  commentaire           text,
  consentement          boolean not null default false,

  -- Choix d'offre (triplet générique, NULL pour orientation / offre unique)
  offre_ref             text,
  offre_label           text,
  offre_duree           text,
  offre_prix_indicatif  integer,
  route                 text,       -- MLR uniquement (Nord/Sud/Est/Ouest)

  -- Total indicatif (colonne GÉNÉRÉE, calculée par Postgres) : nb participants
  -- × prix/pers de l'offre. NULL quand « Conseillez-moi » (offre_prix_indicatif
  -- NULL) = à chiffrer sur mesure côté commercial. Estimation, jamais un devis
  -- ferme. `stored` → figé à l'enregistrement du lead. Lecture seule (l'app ne
  -- l'écrit jamais).
  total_indicatif       integer generated always as (nb_voyageurs * offre_prix_indicatif) stored,

  -- Attribution (premier touchpoint)
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_term              text,
  referrer              text,

  created_at            timestamptz not null default now()
);

create index funnel_cvm_mlr_info_created_at_idx  on public.funnel_cvm_mlr_info (created_at desc);
create index funnel_cvm_mlr_info_funnel_type_idx on public.funnel_cvm_mlr_info (funnel_type);
create index funnel_cvm_mlr_info_email_idx        on public.funnel_cvm_mlr_info (email);

-- ─────────────────────────────────────────────────────────────────────────────
-- Table 2 — funnel_cvm_mlr_com : qualification commerciale (étape 2 facultative),
-- liée par FK. Enregistrement PROGRESSIF : une ligne par lead (upsert on
-- conflict lead_id). `answers` en JSONB : les questions varient par funnel
-- (colonnes creuses évitées) et l'upsert progressif s'écrit sans faire évoluer
-- le DDL.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.funnel_cvm_mlr_com (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid not null unique
                   references public.funnel_cvm_mlr_info (id) on delete cascade,
  answers        jsonb not null default '{}'::jsonb,
  recommendation jsonb,
  completed      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS : activée, AUCUNE policy → aucun accès pour anon/authenticated.
-- Les écritures se font exclusivement via `service_role` (bypass RLS) depuis
-- les Server Actions. Défense en profondeur si la clé anon était exposée.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.funnel_cvm_mlr_info enable row level security;
alter table public.funnel_cvm_mlr_com  enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- Ancien modèle 1-table JSONB : supprimé (décision Ryan — aucune donnée réelle
-- à conserver). `if exists` rend l'instruction sûre et idempotente (no-op si la
-- table est déjà absente). IRRÉVERSIBLE : si un doute subsistait sur un contenu
-- à garder, vérifier d'abord `select count(*) from public.cvm_mlr_leads;`.
-- ─────────────────────────────────────────────────────────────────────────────
drop table if exists public.cvm_mlr_leads;
