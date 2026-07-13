import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cible de production : Render (Vercel = preview uniquement).
  output: "standalone",

  // Configuration de sécurité pour les Server Actions via VS Code Dev Tunnels
  experimental: {
    serverActions: {
      allowedOrigins: ["zdzm065z-3000.inc1.devtunnels.ms"],
    },
  },

  // Next 16 exige de déclarer chaque qualité utilisée par <Image quality>
  // (75 = défaut, 90 = hero MLR).
  images: { qualities: [75, 90] },

  // Les questionnaires CVM/MLR sont intégrés en bas de leur page de
  // présentation : les anciennes URLs dédiées redirigent vers l'ancre.
  // (Orientation garde sa page : c'est un aiguillage sans page produit.)
  async redirects() {
    return [
      {
        source: "/cvm/:univers(explorer|treks|iles|un-mois)/questionnaire",
        destination: "/cvm/:univers#questionnaire",
        permanent: true,
      },
      {
        source: "/mlr/questionnaire",
        has: [{ type: "query", key: "route", value: "(?<route>nord|ouest)" }],
        destination: "/mlr/:route#questionnaire",
        permanent: true,
      },
      {
        source: "/mlr/questionnaire",
        destination: "/mlr#questionnaire",
        permanent: true,
      },
      // Sud et Est retirés du catalogue (directive boss 2026-07-07) : les
      // anciennes URLs retombent sur la landing MLR.
      {
        source: "/mlr/:route(sud|est)",
        destination: "/mlr",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
