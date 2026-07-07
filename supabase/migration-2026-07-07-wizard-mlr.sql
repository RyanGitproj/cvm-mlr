-- Migration 2026-07-07 — refonte wizard (directives boss 07-07).
-- À exécuter dans l'éditeur SQL Supabase AVANT de déployer cette version :
-- l'écran coordonnées MLR écrit ces colonnes, l'INSERT échouerait sans elles.
--
-- Colonnes nullable : seuls les leads MLR portent les opt-ins.
-- NULL = information non demandée (leads CVM, anciens leads) ;
-- false = opt-in explicitement refusé par le lead.

alter table public.funnel_cvm_mlr_info
  add column if not exists optin_documents boolean,
  add column if not exists optin_conseils  boolean;
