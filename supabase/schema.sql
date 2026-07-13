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
-- non demandée par ce funnel (accept_* hors Explorer, projection pour MLR,
-- reco_univers hors orientation) ou qualification invalide (cas théorique —
-- le lead est conservé quand même).

-- Premier formulaire : coordonnées minimales enregistrées avant l'accueil.
-- `temperature` contient : preparation_active | comparaison_destinations |
-- recherche_informations | curiosite.
-- `depart_prevue` contient : moins_3_mois | 3_6_mois | 6_10_mois |
-- plus_1_an | sans_date.
create table public.funnel_leads_tampon (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  prenom      text,
  telephone   text not null,
  email       text not null,
  temperature text not null,
  depart_prevue text not null,
  consentement boolean not null default false,
  created_at  timestamptz not null default now()
);

create index funnel_leads_tampon_created_at_idx
  on public.funnel_leads_tampon (created_at desc);

alter table public.funnel_leads_tampon enable row level security;

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
  -- Durée en jours (un_mois = 30), alignée sur duree_jours du catalogue —
  -- integer depuis la migration 2026-07-10 (auparavant libellé texte).
  offre_duree           integer,
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

  -- Relation vers le premier formulaire. Un même profil peut être relié à
  -- plusieurs demandes/offres pendant sa durée de conservation.
  funnel_leads_tampon_id uuid,

  created_at            timestamptz not null default now(),

  constraint fk_funnel_leads_tampon
    foreign key (funnel_leads_tampon_id)
    references public.funnel_leads_tampon (id)
    on delete set null
);

create index funnel_cvm_mlr_leads_created_at_idx  on public.funnel_cvm_mlr_leads (created_at desc);
create index funnel_cvm_mlr_leads_funnel_type_idx on public.funnel_cvm_mlr_leads (funnel_type);
create index funnel_cvm_mlr_leads_email_idx       on public.funnel_cvm_mlr_leads (email);
create index funnel_cvm_mlr_leads_tampon_idx      on public.funnel_cvm_mlr_leads (funnel_leads_tampon_id);

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

-- Case de compréhension MLR retirée le 2026-07-09 (les exclusions sont un
-- simple texte d'info dans le wizard, plus aucune donnée collectée) —
-- migration des tables créées avant cette date, no-op sinon.
alter table if exists public.funnel_cvm_mlr_leads drop column if exists comprehension;

-- FK vers le catalogue d'offres de l'automatisation aval
-- (cv_mada_offres_catalogue, table live gérée côté Supabase hors repo).
-- Remplie par le code à l'INSERT depuis le mapping en dur de
-- src/config/offers.ts (décision Ryan 2026-07-10). Ce repo s'arrête là :
-- contrainte FK, triggers et calculs associés sont gérés côté Supabase par
-- l'équipe base — d'où l'absence de contrainte ici.
alter table if exists public.funnel_cvm_mlr_leads
  add column if not exists catalogue_offre_id bigint;

-- Migration idempotente pour une base créée avant le sas d'entrée.
create table if not exists public.funnel_leads_tampon (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  prenom      text,
  telephone   text not null,
  email       text not null,
  temperature text not null,
  depart_prevue text not null,
  consentement boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists funnel_leads_tampon_created_at_idx
  on public.funnel_leads_tampon (created_at desc);

alter table public.funnel_leads_tampon enable row level security;

alter table public.funnel_leads_tampon
  add column if not exists consentement boolean not null default false;

alter table public.funnel_leads_tampon
  add column if not exists depart_prevue text;

update public.funnel_leads_tampon
set depart_prevue = 'sans_date'
where depart_prevue is null;

alter table public.funnel_leads_tampon
  alter column depart_prevue set not null;

alter table if exists public.funnel_cvm_mlr_leads
  add column if not exists funnel_leads_tampon_id uuid;

do $$
begin
  alter table public.funnel_cvm_mlr_leads
    drop constraint if exists funnel_cvm_mlr_leads_tampon_unique;

  if not exists (
    select 1 from pg_constraint
    where conname = 'fk_funnel_leads_tampon'
      and conrelid = 'public.funnel_cvm_mlr_leads'::regclass
  ) then
    alter table public.funnel_cvm_mlr_leads
      add constraint fk_funnel_leads_tampon
      foreign key (funnel_leads_tampon_id)
      references public.funnel_leads_tampon (id)
      on delete set null;
  end if;
end $$;

create index if not exists funnel_cvm_mlr_leads_tampon_idx
  on public.funnel_cvm_mlr_leads (funnel_leads_tampon_id);

-- offre_duree : text -> integer, en jours (décision Ryan 2026-07-10).
-- Idempotent : ne fait rien si la colonne est déjà integer. À exécuter
-- APRÈS le déploiement du code (l'ancien code envoie « 15 jours », qu'une
-- colonne integer refuserait). Le cas « mois » est traité en premier :
-- « Environ 1 mois » -> 30 (une extraction naïve de chiffres donnerait 1).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name  = 'funnel_cvm_mlr_leads'
      and column_name = 'offre_duree'
      and data_type   = 'text'
  ) then
    alter table public.funnel_cvm_mlr_leads
      alter column offre_duree type integer
      using (
        case
          when offre_duree is null then null
          when offre_duree ~* 'mois' then 30
          when offre_duree ~ '\d' then (substring(offre_duree from '\d+'))::integer
          else null
        end
      );
  end if;
end $$;
