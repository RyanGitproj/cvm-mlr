# Funnel Madagascar — CVM & MLR

Site de qualification de leads pour deux marques de voyage à Madagascar :
**Célébration Voyage Madagascar** (confort, accompagnement) et **Madagascar
Liberty Routes** (road trip roots). Page mère d'orientation, 2 univers de
marque, 6 questionnaires multi-étapes, persistance Supabase.

## Démarrer

```bash
npm install
cp .env.example .env.local   # compléter les clés Supabase (facultatif en dev)
npm run dev
```

Sans clés Supabase, le site fonctionne : l'enregistrement des leads est
simplement désactivé avec un message utilisateur clair.

## Base de données

Exécuter `supabase/schema.sql` dans l'éditeur SQL du projet Supabase
(table unique `leads`, RLS activé, INSERT anon uniquement).

## Scripts

| Commande            | Rôle                                |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Serveur de développement            |
| `npm run typecheck` | Vérification TypeScript             |
| `npm run lint`      | ESLint                              |
| `npm run test`      | Vitest (fonctions pures, sans mock) |
| `npm run build`     | Build de production (`standalone`)  |

Ordre de validation après toute modification :
`typecheck → lint → test → build`.

## Déploiement

Production : **Render** (`output: "standalone"`). Vercel : preview uniquement.
