-- Le profil visiteur et son cookie vivent 30 jours. Il peut donc demander
-- plusieurs offres sans ressaisir ses coordonnées : relation tampon 1 -> N leads.
alter table if exists public.funnel_cvm_mlr_leads
  drop constraint if exists funnel_cvm_mlr_leads_tampon_unique;

create index if not exists funnel_cvm_mlr_leads_tampon_idx
  on public.funnel_cvm_mlr_leads (funnel_leads_tampon_id);
