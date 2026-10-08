/**
 * The example event log. Event types are the app's real ones (see
 * packages/protocol/src/events.ts in the app repository).
 */

export type Category = "state" | "job" | "command" | "alert" | "system";

export interface LogEvent {
  cat: Category;
  type: string;
  who: string;
  msg: string;
  time: string;
}

const SCRIPT: [Category, string, string, string][] = [
  [
    "job",
    "printer.job_started",
    "Workshop CC2",
    "started <b>kitchen-roll-holder.gcode</b> · 240 layers",
  ],
  ["command", "command.requested", "Garage P1S", "set nozzle to 250 °C"],
  ["command", "command.result", "Garage P1S", "accepted in 84 ms"],
  ["alert", "printer.alert", "Voron 2.4", "filament runout on the extruder"],
  ["state", "printer.status_changed", "Voron 2.4", "printing → paused"],
  ["job", "printer.files_changed", "Desk MK4S", "uploaded <b>trash-bin-inserts.gcode</b>"],
  ["command", "command.requested", "Garage P1S", "set nozzle to 320 °C"],
  ["command", "command.result", "Garage P1S", "refused · above this printer's limit"],
  ["job", "printer.job_ended", "Simulator", "<b>calibration-cube.gcode</b> finished in 41m"],
  ["state", "printer.status_changed", "Spare Ender", "idle → offline"],
  ["system", "auth.login_succeeded", "admin", "signed in from 192.168.1.24"],
  ["command", "command.requested", "Workshop CC2", "pause"],
  ["state", "printer.status_changed", "Workshop CC2", "printing → paused"],
  ["command", "command.requested", "Workshop CC2", "resume"],
  ["state", "printer.status_changed", "Workshop CC2", "paused → printing"],
  ["system", "printer.added", "Desk MK4S", "found by mDNS at 192.168.1.41"],
  ["state", "printer.status_changed", "Desk MK4S", "offline → idle"],
];

export const START_COUNT = 12481;
const START_CLOCK = 12 * 3600 + 4 * 60 + 31;

const fmtTime = (s: number) =>
  [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

/**
 * The nth event in the endless example log, newest last. The gaps between
 * events are fixed, so the build and the browser agree on the first ones.
 */
export function eventAt(n: number): LogEvent {
  const [cat, type, who, msg] = SCRIPT[n % SCRIPT.length]!;
  let clock = START_CLOCK;
  for (let i = 0; i <= n; i++) clock += 4 + ((i * 17) % 37);
  return { cat, type, who, msg, time: fmtTime(clock % 86400) };
}

/** Events shown before the log starts streaming, newest first. */
export const SEEDED = 9;

export const lineHTML = (e: LogEvent, fresh = false) =>
  `<li class="${fresh ? "new" : ""}"><time>${e.time}</time><span class="etype ${e.cat}">${e.type}</span><span class="emsg"><b>${e.who}</b> · ${e.msg}</span></li>`;

export const seededLines = () => Array.from({ length: SEEDED }, (_, i) => eventAt(SEEDED - 1 - i));
