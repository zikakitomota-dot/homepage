import { defineConfig } from "astro/config"

export default defineConfig({
  site: "https://zaleastudio.com",
  base: "/health",
  trailingSlash: "never",
  outDir: "../public/health",
  output: "static",
  // The migrated URLs are emitted only by the main site's sitemap.
  integrations: [],
  compressHTML: true,
  server: {
    host: true,
    port: 3000,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
})
