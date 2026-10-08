/** The app lives in its own repository; most links point there for now. */
const REPO = "https://github.com/OpenPrintProject/openprintstack";

export const links = {
  repo: REPO,
  releases: `${REPO}/releases`,
  docs: `${REPO}#readme`,
  gettingStarted: `${REPO}#getting-started`,
  installation: `${REPO}#installation`,
  data: `${REPO}#data`,
  security: `${REPO}/blob/main/SECURITY.md`,
  licence: `${REPO}/blob/main/LICENSE`,
};

export const site = {
  name: "Open Print Stack",
  tagline: "3D print management that's yours",
  description:
    "Self-hosted, private and free 3D print management. Monitor and control every printer from one dashboard that runs on your own hardware.",
};

/** A path on this site, with the GitHub Pages base path in front of it. */
export const url = (path = "") => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
