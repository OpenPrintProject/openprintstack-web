export interface Feature {
  icon: string;
  title: string;
  badge?: string;
  text: string;
}

export const featureGroups: { title: string; items: Feature[] }[] = [
  {
    title: "Monitor",
    items: [
      {
        icon: "activity",
        title: "Live status",
        text: "Temperatures, progress, layer and time left update the moment the printer reports them",
      },
      {
        icon: "camera",
        title: "Camera snapshots",
        text: "Check on a print from the sofa without opening the vendor's app",
      },
      {
        icon: "spool",
        title: "Filament slots",
        badge: "CANVAS / AMS",
        text: "See which spool sits in which tray, and which one is printing",
      },
      {
        icon: "terminal",
        title: "Event log",
        text: "Every status change, command, upload and fault, with a live tail and filters",
      },
    ],
  },
  {
    title: "Control",
    items: [
      {
        icon: "play",
        title: "Start, pause, resume, cancel",
        text: "The same controls for every printer, whatever brand it is",
      },
      {
        icon: "upload",
        title: "Upload and print",
        text: "Send G-code straight to a printer over your network, no SD card shuffle",
      },
      {
        icon: "move",
        title: "Temperatures, fans and jogging",
        text: "Preheat, home and move the toolhead where the printer allows it",
      },
      {
        icon: "shield",
        title: "Safety checks",
        text: "Commands are checked against what the printer is doing before they're sent",
      },
    ],
  },
  {
    title: "Self-hosted",
    items: [
      {
        icon: "monitor",
        title: "Runs on your computer",
        badge: "macOS / Windows",
        text: "Installs as a background service that starts with your computer",
      },
      {
        icon: "radar",
        title: "Finds your printers",
        text: "Scans your network and asks only for what it can't read, like access codes",
      },
      {
        icon: "phone",
        title: "Any device on your network",
        text: "Open it from a phone, tablet or laptop, with nothing to install on them",
      },
      {
        icon: "heart",
        title: "Free, with no paywalls",
        text: "Open source under the AGPL. No licence fees, paid tiers or locked features",
      },
    ],
  },
];
