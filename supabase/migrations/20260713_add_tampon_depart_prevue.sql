-- Relie la question d'échéance du sas à la table tampon.
-- Les lignes historiques sont classées `sans_date` avant le NOT NULL.
alter table public.funnel_leads_tampon
  add column if not exists depart_prevue text;

update public.funnel_leads_tampon
set depart_prevue = 'sans_date'
where depart_prevue is null;

alter table public.funnel_leads_tampon
  alter column depart_prevue set not null;
