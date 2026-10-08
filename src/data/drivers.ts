/**
 * The printer support table. Capabilities follow the app's Phase 1 plan
 * (docs/phase-1.md in the app repository).
 */

export type Cap = "yes" | "partly" | "no";

export const CAPABILITIES = [
  "Status",
  "Control",
  "Upload",
  "Camera",
  "Filament",
  "Discovery",
] as const;

export interface Driver {
  name: string;
  detail: string;
  icon: "printer" | "server" | "flask";
  caps: [Cap, Cap, Cap, Cap, Cap, Cap];
  status: string;
  supported?: boolean;
  basis: string;
  note: string;
}

export const drivers: Driver[] = [
  {
    name: "Elegoo Centauri Carbon 2",
    detail: "with CANVAS · MQTT · HTTP · UDP",
    icon: "printer",
    caps: ["yes", "yes", "yes", "yes", "yes", "yes"],
    status: "Supported",
    supported: true,
    basis: "Tested on hardware",
    note: "Firmware v02.01.00.00, LAN Only mode",
  },
  {
    name: "Bambu Lab",
    detail: "P1, A1, X1, H2 · MQTT over TLS · FTPS · SSDP",
    icon: "printer",
    caps: ["yes", "partly", "yes", "partly", "yes", "yes"],
    status: "Experimental",
    basis: "Built from docs",
    note: "Control needs Developer Mode",
  },
  {
    name: "Prusa · PrusaLink",
    detail: "MK4/S, MK3.9, MK3.5, XL, MINI, CORE One · mDNS",
    icon: "printer",
    caps: ["yes", "partly", "yes", "no", "no", "yes"],
    status: "Experimental",
    basis: "Built from docs",
    note: "Pause, resume and stop",
  },
  {
    name: "Klipper · Moonraker",
    detail: "Voron, Sovol, Creality K-series · WebSocket",
    icon: "server",
    caps: ["yes", "yes", "yes", "yes", "no", "partly"],
    status: "Experimental",
    basis: "Built from docs",
    note: "Found by subnet scan",
  },
  {
    name: "OctoPrint",
    detail: "1.11 · REST + push socket · mDNS",
    icon: "server",
    caps: ["yes", "yes", "yes", "yes", "no", "yes"],
    status: "Experimental",
    basis: "Built from docs",
    note: "Approve with Application Keys",
  },
  {
    name: "Simulated printer",
    detail: "Temperatures, prints, a camera and faults",
    icon: "flask",
    caps: ["yes", "yes", "yes", "yes", "no", "no"],
    status: "Built in",
    basis: "For trying things out",
    note: "Builds from source",
  },
];
