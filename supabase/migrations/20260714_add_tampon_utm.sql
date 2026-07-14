-- Attribution du premier point d'entrée enregistrée dès le formulaire d'accueil.
alter table public.funnel_leads_tampon
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists referrer text;
