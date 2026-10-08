# Open Print Stack website

The website for [Open Print Stack](https://github.com/OpenPrintProject/openprintstack), built with [Astro](https://astro.build) and published on GitHub Pages at <https://openprintproject.github.io/openprintstack-web/>.

It's a static site: every page is plain HTML, CSS and a little JavaScript, built ahead of time. Fonts are served from the site itself, so visitors' browsers don't contact anyone else.

## Getting started

You need **Node.js 26** (the `.node-version` file names it) and **pnpm 12**, the same as the app repository.

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:4321/openprintstack-web/>. In development only, a **Filament** control in the bottom-right corner tries the accent in other colours. It never reaches the live site.

| Command        | What it does                                                   |
| -------------- | -------------------------------------------------------------- |
| `pnpm dev`     | Runs the site with live reloading.                             |
| `pnpm build`   | Builds the site into `dist/`.                                  |
| `pnpm preview` | Serves `dist/` as GitHub Pages would, to check a build.        |
| `pnpm format`  | Formats every file with Prettier. CI runs `pnpm format:check`. |

## Publishing

`.github/workflows/deploy.yml` builds every pull request as a check, and builds and publishes every push to `main`.

Before the first deploy, turn Pages on once: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**. Until then the deploy fails at "Read the Pages address".

GitHub Pages serves this repository under `/openprintstack-web/`, so links inside the site need that base path. Use `url()` from `src/site.ts` for them, for example `url("#download")`, rather than writing `/…` by hand.

### A custom domain

Add the domain in **Settings → Pages**, and add a `public/CNAME` file containing it. Nothing else changes: the workflow reads the address and base path from the Pages settings, so the build follows.

## Layout

```text
src/
  pages/        index.astro (the homepage) and 404.astro, which GitHub Pages shows for missing pages
  layouts/      Base.astro: the document head, header and footer
  components/   one file per section of the homepage, plus the icon sprite and logo
  data/         the printer support table and the feature list
  lib/          the example fleet and event log in the product shot, shared by the build and the browser
  styles/       global.css, with the colour and type tokens at the top
  site.ts       the site's name, links to the app repository, and url()
public/         files copied as they are, such as favicon.svg
```

The printer support table follows the app's Phase 1 plan (`docs/phase-1.md` in the app repository). Update `src/data/drivers.ts` as drivers land.
