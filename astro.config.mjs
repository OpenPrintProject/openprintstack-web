// @ts-check
import { defineConfig } from "astro/config";

// GitHub Pages serves this repository at
// https://openprintproject.github.io/openprintstack-web/. The deploy workflow
// passes the real address from actions/configure-pages, so moving to a custom
// domain later only needs a public/CNAME file and the Pages setting.
export default defineConfig({
  site: process.env.SITE_ORIGIN || "https://openprintproject.github.io",
  base: process.env.SITE_BASE ?? "/openprintstack-web",
  // GitHub Pages serves each page as a folder, so links end in a slash. This
  // also makes import.meta.env.BASE_URL always end in one.
  trailingSlash: "always",
});
