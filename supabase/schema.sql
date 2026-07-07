-- Schéma des leads — table plate UNIQUE (décision Ryan 2026-07-07 :
-- colonnes typées distinctes, pensées pour l'automatisation aval).
-- À exécuter dans l'éditeur SQL Supabase.
--
-- Sécurité : RLS activée SANS aucune policy → deny-all pour anon ET
-- authenticated. Toutes les écritures passent par le client `service_role`
-- côté serveur (Server Actions), qui bypasse la RLS. La clé `service_role` ne
-- vit jamais dans le bundle navigateur (variable SANS préfixe NEXT_PUBLIC_).
-- Le navigateur ne parle jamais à Supabase directement.
--
-- Sémantique des NULL sur les colonnes de qualification : NULL = information
-- non demandée par ce funnel (comprehension hors MLR, accept_* hors Explorer,
-- projection pour MLR, reco_univers hors orientation) ou qualification
-- invalide (cas théorique — le lead est conservé quand même).

create table public.funnel_cvm_mlr_leads (
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
  -- « Mois de départ » libre et facultatif de l'écran coordonnées MLR — ne
  -- pas confondre avec depart_fenetre (fenêtre Q3 fermée, commune aux 6).
  periode               text,
  commentaire           text,
  consentement          boolean not null default false,

  -- Newsletter facultative, les 2 marques (RGPD simplifié, décision Ryan
  -- 2026-07-07 soir : une seule case obligatoire d'utilisation des données
  -- + cette case facultative). NULL = non demandé (anciens leads) ;
  -- false = décochée.
  optin_newsletter      boolean,

  -- Choix d'offre (triplet générique, NULL pour orientation / offre unique)
  offre_ref             text,
  offre_label           text,
  offre_duree           text,
  offre_prix_indicatif  integer,
  route                 text,       -- MLR uniquement (Nord/Ouest) — Q1 du wizard MLR

  -- Total indicatif (colonne GÉNÉRÉE, calculée par Postgres) : nb participants
  -- × prix/pers de l'offre. NULL quand le prix est à chiffrer sur mesure.
  -- Estimation, jamais un devis ferme. `stored` → figé à l'enregistrement du
  -- lead. Lecture seule (l'app ne l'écrit jamais).
  total_indicatif       integer generated always as (nb_voyageurs * offre_prix_indicatif) stored,

  -- Qualification (extraite du wizard par processLead, src/lib/leads/) ──────
  -- Q1 de projection — domaine selon funnel_type (garde-fou = Zod, pas de
  -- CHECK : l'union des enums serait une fausse défense) :
  --   cvm_orientation : explorer | treks | iles | un_mois   (= intention)
  --   cvm_treks       : nord | ouest | sud | est | a_orienter (= décor)
  --   cvm_explorer    : jungles | canyons | plateaux | autre  (= terrain)
  --   cvm_iles        : nosy_be | sainte_marie | combine | autre
  --   cvm_un_mois     : decouverte | expatriation | creation_societe | retraite | autre
  --   mlr             : toujours NULL (sa Q1 est la colonne route)
  projection            text,
  -- Texte libre « Autre — je précise », seulement si projection = 'autre'.
  projection_precision  text,
  -- Fenêtre de départ Q3, commune aux 6 funnels.
  -- = DEPART_FENETRES, src/lib/validations/common.ts
  depart_fenetre        text check (depart_fenetre in ('0_2', '2_4', '4_6', '6_10', '10_plus')),
  -- Case de compréhension des exclusions (MLR uniquement).
  comprehension         boolean,

  -- Recommendation (moteur de segmentation, src/lib/segmentation/) — une
  -- donnée pour l'équipe aval, jamais un score ni une action.
  -- = clés de FENETRES, src/config/segmentation.ts
  reco_fenetre          text check (reco_fenetre in ('proche', 'construction', 'lointain')),
  -- Univers CVM recommandé (orientation uniquement).
  -- = clés de ORIENTATION_UNIVERS, src/config/segmentation.ts
  reco_univers          text,

  -- Choix de suite de l'écran final (RDV expert / brochure), écrit après
  -- l'enregistrement via le cookie lead signé HMAC.
  -- = mlrSuiteSchema, src/lib/validations/mlr.ts
  suite                 text check (suite in ('rdv', 'brochure')),

  -- Attribution (premier touchpoint)
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_term              text,
  referrer              text,

  created_at            timestamptz not null default now()
);

create index funnel_cvm_mlr_leads_created_at_idx  on public.funnel_cvm_mlr_leads (created_at desc);
create index funnel_cvm_mlr_leads_funnel_type_idx on public.funnel_cvm_mlr_leads (funnel_type);
create index funnel_cvm_mlr_leads_email_idx       on public.funnel_cvm_mlr_leads (email);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS : activée, AUCUNE policy → aucun accès pour anon/authenticated.
-- Les écritures se font exclusivement via `service_role` (bypass RLS) depuis
-- les Server Actions. Défense en profondeur si la clé anon était exposée.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.funnel_cvm_mlr_leads enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- Anciens modèles : 2 tables info/com (fusionnées le 2026-07-07, données de
-- test jetables — décision Ryan) et 1 table JSONB. `if exists` rend les
-- instructions idempotentes. IRRÉVERSIBLE : en cas de doute, vérifier d'abord
-- `select count(*) from public.funnel_cvm_mlr_info;`.
-- ─────────────────────────────────────────────────────────────────────────────
drop table if exists public.funnel_cvm_mlr_com;
drop table if exists public.funnel_cvm_mlr_info;
drop table if exists public.cvm_mlr_leads;
