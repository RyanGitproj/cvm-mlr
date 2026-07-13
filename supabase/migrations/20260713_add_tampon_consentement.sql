-- Preuve du consentement donné dans le formulaire d'entrée.
-- `created_at` porte déjà la date et l'heure associées à cette preuve.
alter table public.funnel_leads_tampon
  add column if not exists consentement boolean not null default false;
