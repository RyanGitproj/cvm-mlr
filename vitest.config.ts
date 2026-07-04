import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Node par défaut (fonctions pures) ; les tests de composants déclarent
    // jsdom via le pragma « @vitest-environment jsdom » en tête de fichier.
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
