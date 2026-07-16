-- Parité d'attribution avec funnel_cvm_mlr_leads : utm_content manquait dans
-- le tampon (capturé côté client mais jamais stocké). À exécuter AVANT de
-- déployer le code qui écrit/relit cette colonne.
alter table public.funnel_leads_tampon
  add column if not exists utm_content text;
