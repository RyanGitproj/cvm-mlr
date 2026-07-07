-- Migration 2026-07-07 — refonte wizard (directives boss 07-07).
-- À exécuter dans l'éditeur SQL Supabase AVANT de déployer cette version :
-- l'écran coordonnées écrit cette colonne, l'INSERT échouerait sans elle.
--
-- RGPD simplifié (décision Ryan 07-07 au soir) : une seule case obligatoire
-- d'utilisation des données (colonne `consentement` existante) + une
-- newsletter facultative, commune aux 2 marques. Les colonnes
-- optin_documents / optin_conseils un temps prévues ne sont jamais créées.
--
-- NULL = information non demandée (anciens leads) ; false = décochée.

alter table public.funnel_cvm_mlr_info
  add column if not exists optin_newsletter boolean;
