# Rapport de test complet — funnels CVM & MLR (2026-07-09)

QA « comme un testeur de formulaire pro » avant mise en prod : revue de code,
parcours réels **à la souris** (Chrome headless + CDP, événements trusted
`Input.dispatchMouseEvent` / `Input.dispatchKeyEvent`, viewport mobile
390×844), vérification des lignes écrites dans Supabase, audit visuel par
mesure DOM sur 14 pages × 2 viewports. 8 leads de test insérés
(`test-qa+*@example.com`) puis **supprimés — la base est propre**.

---

## 1. Le point de départ : `route` NULL en prod

**Verdict : ce n'est pas un bug de code.** La chaîne complète a été vérifiée
et testée de bout en bout :

- Le schéma Zod MLR (`mlrWizardSchema`) rend `route` **obligatoire** — un
  envoi MLR sans route serait rejeté par la validation serveur, le lead
  n'existerait pas.
- En E2E réel : parcours `/mlr` (route choisie en Q1), `/mlr/nord` et
  `/mlr/ouest` (route pré-remplie, Q1 sautée) → les 3 lignes en base ont
  `route = "ouest" / "nord" / "ouest"`. ✔

**Explication la plus probable de votre test prod** : la ligne NULL est un
lead d'un funnel **CVM** — pour les 5 funnels CVM, `route` est NULL **par
design** (c'est la Q1 du seul wizard MLR, cf. commentaire
`supabase/schema.sql`). À vérifier sur la ligne concernée : si
`funnel_type` commence par `cvm_`, tout est normal. Si c'est `mlr`, alors
la prod tourne sur un déploiement antérieur → redéployer.

## 2. Checks code

| Check | Résultat |
| --- | --- |
| `npm run typecheck` | ✔ 0 erreur |
| `npm run lint` | ✔ 0 erreur, 1 warning connu (`react-hooks/incompatible-library` sur `form.watch`, sans effet) |
| `npm run test` | ✔ 38/38 tests |
| `npm run build` | ✔ build production OK (toutes les routes générées) |

## 3. Parcours E2E à la souris — 6 funnels, tout PASS

Chaque parcours a été joué clic par clic jusqu'à l'écran final **et** la
ligne Supabase relue colonne par colonne (sans PII).

| Scénario | Vérifié | Résultat |
| --- | --- | --- |
| A — `/mlr` complet | Q1 route → Q2 offre → Q3 période → Q4 voyageurs → coordonnées, auto-avance, barre « Étape 1 sur 4 », chips récap, cas final « proche » (0-2 mois), suite RDV | ✔ `route=ouest`, `offre_ref=15_jours`, `prix=1800`, `total_indicatif=3600`, `periode="Novembre 2026"`, `optin_newsletter=true`, `suite=rdv` |
| B — `/mlr/nord` pré-rempli | Q1 sautée, barre « Étape 1 sur 3 », cas final « lointain » (10+ mois), CTA primaire = brochure | ✔ `route=nord`, `reco_fenetre=lointain`, `suite=brochure`, `optin_newsletter=false` (décochée) |
| C — `/cvm/explorer` | « Plus de 4 » : pas d'auto-avance, blocage sans effectif (« Merci d'indiquer environ combien vous serez. »), effectif réel stocké ; cas final « construction » (6-10) | ✔ `projection=jungles`, `nb_voyageurs=6`, `total_indicatif=16800` |
| D — `/cvm/iles` | « Autre — je précise » : pas d'auto-avance, bouton Continuer ; submit vide → 4 erreurs ; email + téléphone invalides signalés ; correction → envoi OK | ✔ `projection=autre`, `projection_precision="Île aux Nattes en famille"` |
| E — `/cvm/un-mois` | Carte d'offre **unique** (5 300 €) ; « ← Retour » conserve la sélection | ✔ `offre_ref=un_mois`, `total_indicatif=21200` |
| F — `/cvm/orientation` | 3 questions seulement, pas d'offre, bloc « L'expérience faite pour vous » | ✔ `reco_univers=treks`, `offre_*` NULL |
| G — Attribution UTM | Entrée `/mlr/ouest?utm_source=…&utm_medium=…&utm_campaign=…`, parcours complet | ✔ les 3 colonnes `utm_*` remplies en base |
| H — Double-clic sur l'envoi | 2 clics souris coup sur coup sur le CTA | ✔ **1 seule ligne** créée (garde anti double-clic OK) |

Tracking (`window.dataLayer`, sans GTM ID — assertions sur les events) :
`page_view`, `funnel_start` (1re interaction), 4× `funnel_step`,
`lead_submitted` **enrichi** (`funnel_type`, `brand`, `offre_ref/label/prix`,
`depart_fenetre`, `nb_voyageurs`, `route`), `suite_click`. ✔ conforme au
guide GTM/GA4.

Téléphone : saisie « 0612345678 » formatée « 06 12 34 56 78 », stockée E.164
(`+33…`). ✔

## 4. Routes, redirections, accès directs

| URL | Attendu | Résultat |
| --- | --- | --- |
| `/mlr/sud`, `/mlr/est` | redirection permanente → `/mlr` | ✔ 308 |
| `/cvm/*/questionnaire`, `/mlr/questionnaire` | → ancre `#questionnaire` de la page | ✔ 308 |
| `/merci` sans cookie (accès direct) | message générique | ✔ « Cette page confirme l'envoi d'une demande » |
| `/merci` avec cookie (après envoi) | confirmation nominale personnalisée | ✔ « Merci Claude, votre demande Road Trip Liberty Roots… » + profil |

## 5. Audit visuel (mesure DOM, 14 pages × 390×844 et 1280×900)

- **Débordement horizontal : 0 problème** sur les 28 combinaisons
  (`scrollWidth === innerWidth` partout).
- **CTA above the fold mobile** : ✔ sur les 4 pages aventure CVM (bouton
  navbar `y=48` + CTA hero ~`y=360-420`), ✔ `/cvm` et `/mlr` (~`y=420-480`),
  ✔ `/mlr/nord|ouest` (`y=458`).
- Bandeau cookies CNIL présent, GTM non chargé sans consentement. ✔

## 6. Problèmes et points relevés — à décider ensemble

Par ordre d'importance :

1. **[prod, à vérifier] La ligne `route` NULL de votre test** — regarder son
   `funnel_type` dans Supabase. `cvm_*` → comportement normal (colonne MLR
   uniquement). `mlr` → la prod n'est pas sur le dernier déploiement.
2. **[page mère `/` mobile] Aucun CTA entièrement visible au fold** : le
   hero n'a pas de bouton ; la carte CVM (le vrai CTA) n'est visible qu'aux
   2/3 (`top=508`), la carte **MLR est entièrement sous le fold**
   (`top=943`). Risque : biais d'exposition vers CVM + règle projet « CTA
   principal above the fold » non satisfaite strictement sur cette page.
   → Décision design : bouton hero « Choisir mon univers » (scroll), ou
   cartes plus compactes au premier écran.
3. **[docs désynchronisées] CLAUDE.md + commentaire `schema.sql:12`**
   mentionnent encore les acceptations `accept_certificat`/`accept_briefing`
   (Explorer) et la case `comprehension` (MLR), **retirées du code et de la
   table**. Si la table prod a été créée avec une version antérieure du
   schéma, les colonnes `accept_*` y sont peut-être orphelines (le schema.sql
   actuel ne les migre pas, contrairement à `comprehension`). → Mettre à jour
   la doc ; ajouter un `drop column if exists accept_certificat/accept_briefing`
   si besoin.
4. **[cohérence de ton, mineur] `/merci` vouvoie toujours** (« votre demande
   Road Trip Liberty Roots est bien reçue », « vos réponses ») même pour un
   lead MLR, alors que MLR tutoie partout (règle boss). Page fallback rarement
   vue (l'écran final in-funnel est la confirmation nominale), mais visible
   après un envoi MLR si l'utilisateur recharge. → Variante tutoyée par brand ?
5. **[trace mineure] `referrer` NULL en accès direct** — normal (pas de
   referrer navigateur), rien à corriger ; noté pour la lecture des données.
6. **[lint] 1 warning `react-hooks/incompatible-library`** sur `form.watch`
   dans `LeadFunnel` — limitation connue react-hook-form × React Compiler,
   sans effet constaté (tous les parcours passent).

## 7. État laissé après la QA

- Les 8 leads de test ont été **supprimés** de la table (comptage vérifié :
  exactement 8). Vos données réelles n'ont pas été touchées ni lues (lecture
  limitée aux colonnes techniques de mes propres lignes de test).
- `npm run build` a été exécuté en dernier : le dev server a été arrêté
  avant (il écrase `.next`) — le relancer avec `npm run dev`.
- Tests exécutés en local (`next dev`) contre la base Supabase du projet ;
  la prod Render n'a pas été re-testée — seul point restant : le point 1.
