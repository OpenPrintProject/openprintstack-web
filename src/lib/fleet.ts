/**
 * The example fleet in the hero's product shot. The cards are rendered at
 * build time, and the browser reuses these functions to animate them.
 */

export type Status = "printing" | "paused" | "idle" | "offline";
type Shape = "tube" | "bin" | "box" | "cube";

export interface Printer {
  id: string;
  name: string;
  model: string;
  status: Status;
  experimental?: boolean;
  file?: string;
  progress?: number;
  layers?: number;
  minutesPerPct?: number;
  alert?: string;
  lastSeen?: string;
  /** [current, target] in °C; a target of 0 means the heater is off. */
  nozzle?: [number, number];
  bed?: [number, number];
  shape?: Shape;
  color?: string;
  slots?: string[];
  activeSlot?: number;
}

export const fleet: Printer[] = [
  {
    id: "cc2",
    name: "Workshop CC2",
    model: "Elegoo Centauri Carbon 2",
    status: "printing",
    file: "kitchen-roll-holder.gcode",
    progress: 0.62,
    layers: 240,
    minutesPerPct: 1.9,
    nozzle: [220, 220],
    bed: [60, 60],
    shape: "tube",
    color: "#d9dde3",
    slots: ["#d9dde3", "#1c1f24", "#b9e64a", "#ef8a3a"],
    activeSlot: 0,
  },
  {
    id: "p1s",
    name: "Garage P1S",
    model: "Bambu Lab P1S",
    experimental: true,
    status: "printing",
    file: "trash-bin-base.3mf",
    progress: 0.28,
    layers: 220,
    minutesPerPct: 3.1,
    nozzle: [250, 250],
    bed: [70, 70],
    shape: "bin",
    color: "#ef8a3a",
    slots: ["#ef8a3a", "#2f6fd6", "#f2f2f2", "#2b2b2b"],
    activeSlot: 0,
  },
  {
    id: "mk4",
    name: "Desk MK4S",
    model: "Prusa MK4S",
    experimental: true,
    status: "idle",
    nozzle: [24, 0],
    bed: [23, 0],
    slots: ["#e2483b"],
    activeSlot: 0,
  },
  {
    id: "voron",
    name: "Voron 2.4",
    model: "Klipper · Moonraker",
    experimental: true,
    status: "paused",
    file: "trash-bin-inserts.gcode",
    progress: 0.47,
    layers: 205,
    alert: "Filament runout",
    nozzle: [182, 0],
    bed: [100, 100],
    shape: "box",
    color: "#8a63e0",
    slots: ["#8a63e0"],
    activeSlot: 0,
  },
  {
    id: "ender",
    name: "Spare Ender",
    model: "OctoPrint",
    experimental: true,
    status: "offline",
    lastSeen: "2 days ago",
  },
  {
    id: "sim",
    name: "Simulator",
    model: "Simulated printer",
    status: "printing",
    file: "calibration-cube.gcode",
    progress: 0.91,
    layers: 200,
    minutesPerPct: 0.45,
    nozzle: [210, 210],
    bed: [60, 60],
    shape: "cube",
    color: "#3fc7d9",
    slots: [],
  },
];

export const fleetCounts = (["printing", "idle", "paused", "offline"] as const).reduce(
  (acc, s) => ({ ...acc, [s]: fleet.filter((p) => p.status === s).length }),
  { all: fleet.length } as Record<Status | "all", number>,
);

const STATUS_LABEL: Record<Status, string> = {
  printing: "Printing",
  paused: "Paused",
  idle: "Idle",
  offline: "Offline",
};

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const towards = f < 0 ? 0 : 255;
  const t = Math.abs(f);
  const mix = (c: number) => Math.round(c + (towards - c) * t);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

interface Drawn {
  svg: string;
  /** Where the nozzle tip sits: the top of the print. */
  tip: number;
}

interface BoxSpec {
  x: number;
  w: number;
  dx: number;
  dy: number;
  H: number;
  hollow: boolean;
}

function box(c: string, p: number, { x, w, dx, dy, H, hollow }: BoxSpec): Drawn {
  const base = 121,
    h = H * p,
    top = base - h,
    r = x + w;
  const inset = hollow
    ? `<path d="M${x + 5} ${top - 1.5}H${r - 5}L${r + dx - 7} ${top - dy + 2}H${x + dx + 3}Z" fill="${shade(c, -0.6)}"/>`
    : "";
  return {
    tip: top - dy / 2 - 1,
    svg: `<path d="M${r} ${top}L${r + dx} ${top - dy}V${base - dy}L${r} ${base}Z" fill="${shade(c, -0.45)}"/>
      <path d="M${r} ${top}L${r + dx} ${top - dy}V${base - dy}L${r} ${base}Z" fill="url(#ll-ID)"/>
      <rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${c}"/>
      <rect x="${x}" y="${top}" width="${w}" height="${h}" fill="url(#ll-ID)"/>
      <rect x="${x}" y="${top}" width="${w}" height="${h}" fill="url(#fshade-ID)"/>
      <path d="M${x} ${top}H${r}L${r + dx} ${top - dy}H${x + dx}Z" fill="${shade(c, 0.18)}"/>
      ${inset}`,
  };
}

const SHAPES: Record<Shape, (c: string, p: number) => Drawn> = {
  tube(c, p) {
    const h = 74 * p,
      top = 118 - h;
    return {
      tip: top - 1,
      svg: `<ellipse cx="150" cy="118" rx="34" ry="7" fill="url(#obj-ID)"/>
        <rect x="116" y="${top}" width="68" height="${h}" fill="url(#obj-ID)"/>
        <rect x="116" y="${top}" width="68" height="${h}" fill="url(#ll-ID)"/>
        <ellipse cx="150" cy="${top}" rx="34" ry="7" fill="${shade(c, 0.12)}"/>
        <ellipse cx="150" cy="${top}" rx="25" ry="4.8" fill="${shade(c, -0.6)}"/>`,
    };
  },
  bin: (c, p) => box(c, p, { x: 106, w: 88, dx: 15, dy: 9, H: 62, hollow: true }),
  box: (c, p) => box(c, p, { x: 114, w: 72, dx: 13, dy: 8, H: 50, hollow: true }),
  cube: (c, p) => box(c, p, { x: 126, w: 46, dx: 11, dy: 7, H: 46, hollow: false }),
};

/** The part on the bed, drawn to the printer's progress. */
export function objectFor(pr: Printer): Drawn {
  if (!pr.shape || !pr.color) return { svg: "", tip: 40 };
  const o = SHAPES[pr.shape](pr.color, pr.progress ?? 0);
  return { svg: o.svg.replaceAll("ID", pr.id), tip: o.tip };
}

function headPosition(pr: Printer, tip: number) {
  if (pr.status === "printing") return { y: tip, x: 0 };
  if (pr.status === "paused") return { y: tip - 16, x: 72 };
  return { y: 44, x: -86 };
}

/** A camera snapshot of the printer's chamber. */
function camSVG(pr: Printer) {
  const id = pr.id;
  if (pr.status === "offline") {
    return `<svg viewBox="0 0 300 134" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><pattern id="scan-${id}" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="rgba(255,255,255,.035)"/></pattern></defs>
      <rect width="300" height="134" fill="#0c0e11"/><rect width="300" height="134" fill="url(#scan-${id})"/></svg>`;
  }
  const c = pr.color ?? "#999999";
  const obj = objectFor(pr);
  const head = headPosition(pr, obj.tip);
  return `<svg viewBox="0 0 300 134" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="ch-${id}" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#090b0e"/></radialGradient>
      <linearGradient id="lamp-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,248,230,.16)"/><stop offset="1" stop-color="rgba(255,248,230,0)"/></linearGradient>
      <linearGradient id="bed-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f4f2c"/><stop offset="1" stop-color="#8c7643"/></linearGradient>
      <linearGradient id="obj-${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c, -0.5)}"/><stop offset=".42" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.55)}"/></linearGradient>
      <linearGradient id="fshade-${id}" x1="0" x2="1"><stop offset="0" stop-color="rgba(0,0,0,.25)"/><stop offset=".5" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,.18)"/></linearGradient>
      <pattern id="ll-${id}" width="6" height="2.4" patternUnits="userSpaceOnUse"><rect width="6" height="0.9" fill="rgba(0,0,0,.2)"/></pattern>
      <radialGradient id="glow-${id}"><stop offset="0" stop-color="rgba(255,150,70,.95)"/><stop offset="1" stop-color="rgba(255,120,40,0)"/></radialGradient>
    </defs>
    <rect width="300" height="134" fill="url(#ch-${id})"/>
    <rect width="300" height="44" fill="url(#lamp-${id})"/>
    <path d="M46 0V102M254 0V102" stroke="#2c3239" stroke-width="5"/>
    <path d="M20 128H280L253 100H47Z" fill="url(#bed-${id})"/>
    <path d="M20 128H280V134H20Z" fill="#221c0f"/>
    <g data-k="obj">${obj.svg}</g>
    <g data-k="headwrap" transform="translate(0 ${head.y})">
      <rect x="16" y="-27" width="268" height="7" rx="2" fill="#363d45"/>
      <rect x="16" y="-27" width="268" height="1.6" fill="#5a646f"/>
      <g class="head${pr.status === "printing" ? " moving" : ""}" transform="translate(${head.x} 0)">
        <rect x="131" y="-36" width="38" height="25" rx="4" fill="#1d2227" stroke="#47505a"/>
        <rect x="137" y="-31" width="9" height="2.5" rx="1" fill="#5d6873"/>
        <path d="M144.5 -11H155.5L152 -2.5H148Z" fill="#c09a52"/>
        ${pr.status === "printing" ? `<circle cx="150" cy="-1.5" r="7" fill="url(#glow-${id})"/>` : ""}
      </g>
    </g>
  </svg>`;
}

const fmtEta = (min: number) => {
  const m = Math.max(1, Math.round(min));
  return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m left` : `${m}m left`;
};

/** The numbers on a printing or paused card. */
export function jobLines(pr: Printer) {
  const pct = Math.floor((pr.progress ?? 0) * 100);
  const layers = pr.layers ?? 0;
  const layer = Math.max(1, Math.round((pr.progress ?? 0) * layers));
  const right = pr.status === "paused" ? "Paused" : fmtEta((100 - pct) * (pr.minutesPerPct ?? 1));
  return { pct, layer, layers, right };
}

export const tempHTML = ([cur, target]: [number, number]) =>
  target ? `${cur}° <em>/ ${target}°</em>` : `${cur}°`;

export function cardHTML(pr: Printer) {
  const head = `<div class="ptitle"><strong>${pr.name}</strong>${pr.experimental ? '<span class="exp" title="Experimental driver">EXP</span>' : ""}</div>
    <div class="pmodel">${pr.model}</div>`;

  let mid: string;
  if (pr.status === "printing" || pr.status === "paused") {
    const j = jobLines(pr);
    mid = `<div class="pjob"><span class="file">${pr.file}</span><span class="pct" data-k="pct">${j.pct}%</span></div>
      <div class="bar"><i data-k="bar" style="width:${j.pct}%"></i></div>
      <div class="pmeta"><span data-k="layer">Layer ${j.layer} / ${j.layers}</span><span data-k="eta">${j.right}</span></div>
      ${pr.alert ? `<div class="palert"><svg class="ic"><use href="#i-alert"/></svg>${pr.alert} · waiting for you</div>` : ""}`;
  } else if (pr.status === "idle") {
    mid = `<div class="pidle"><svg class="ic"><use href="#i-check-circle"/></svg>Ready · bed clear</div>`;
  } else {
    mid = `<div class="pidle off"><svg class="ic"><use href="#i-wifi-off"/></svg>Last seen ${pr.lastSeen}</div>`;
  }

  let temps: string;
  if (pr.status === "offline" || !pr.nozzle || !pr.bed) {
    temps = `<div class="ptemps"><span><svg class="ic"><use href="#i-nozzle"/></svg>—</span><span><svg class="ic"><use href="#i-bed"/></svg>—</span></div>`;
  } else {
    const slots = (pr.slots ?? [])
      .map(
        (col, i) =>
          `<i style="background:${col}" class="${i === pr.activeSlot && pr.status === "printing" ? "active" : ""}"></i>`,
      )
      .join("");
    temps = `<div class="ptemps">
      <span class="${pr.nozzle[1] ? "heating" : ""}"><svg class="ic"><use href="#i-nozzle"/></svg><span data-k="nozzle">${tempHTML(pr.nozzle)}</span></span>
      <span class="${pr.bed[1] ? "heating" : ""}"><svg class="ic"><use href="#i-bed"/></svg><span data-k="bed">${tempHTML(pr.bed)}</span></span>
      ${slots ? `<span class="slots" title="Filament slots">${slots}</span>` : ""}
    </div>`;
  }

  const overlay =
    pr.status === "offline"
      ? `<div class="cam-off"><svg class="ic"><use href="#i-wifi-off"/></svg>No connection</div>`
      : `<span class="cam-time">Snapshot · 2s ago</span>`;

  return `<article class="pcard" data-status="${pr.status}" data-id="${pr.id}">
    <div class="cam">${camSVG(pr)}<span class="cam-status ${pr.status}"><i></i>${STATUS_LABEL[pr.status]}</span>${overlay}</div>
    <div class="pbody">${head}${mid}${temps}</div>
  </article>`;
}
