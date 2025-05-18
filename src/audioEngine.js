/* ------------------------------------------------------------------------------
   Simple 9-pad step-looper using Tone.js
   Fixes:
   • Every loop now locks to the **global grid origin (0:0:0)**, regardless of
     when you toggle it on.
   • Subdivision assignment is deterministic: the first enabled pad gets the
     longest cycle, the second gets the next, …
     (order = 1m, 2n, 4n, 8n, 16n by default — configurable).
------------------------------------------------------------------------------ */

import * as Tone from "tone";

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. Synth voices                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
const synths = [
  new Tone.MembraneSynth(),
  new Tone.MetalSynth(),
  new Tone.Synth({ oscillator: { type: "triangle" } }),
  new Tone.Synth({ oscillator: { type: "square" } }),
  new Tone.Synth({ oscillator: { type: "sawtooth" } }),
  new Tone.Synth({ oscillator: { type: "triangle" } }),
  new Tone.MembraneSynth(),
  new Tone.MetalSynth(),
  new Tone.Synth(),
].map((s) => s.toDestination());

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. Globals                                                                */
/* ────────────────────────────────────────────────────────────────────────── */
const subdivisions = ["1m", "2n", "4n", "8n", "16n"]; // add more if needed
const loops = Array(9).fill(null); // { loop, sub } | null

/* Return the next grid-aligned time for a given subdivision */
function nextGridTime(sub) {
  const dur = Tone.Time(sub).toTicks();
  const nowT = Tone.Transport.ticks;
  const next = Math.ceil(nowT / dur) * dur; // smallest multiple ≥ now
  return Tone.Time(next, "i").toSeconds();
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. Public API                                                             */
/* ────────────────────────────────────────────────────────────────────────── */
export function play(index) {
  synths[index]?.triggerAttackRelease("C4", "8n");
}

export async function toggleTransport() {
  if (Tone.context.state !== "running") await Tone.start();
  if (Tone.Transport.state === "started") {
    Tone.Transport.stop();
    return false;
  } else {
    Tone.Transport.start();
    return true;
  }
}

export function setBpm(bpm) {
  Tone.Transport.bpm.value = bpm;
}

/**
 * Toggle a looping note for the given pad index.
 * Pads are assigned subdivisions in *fixed order* defined by `subdivisions`.
 * The loop always starts on the next grid-aligned tick so multiple pads stay
 * phase-aligned even if enabled at arbitrary times.
 *
 * Returns `true` when the loop is now *active*, `false` when *deactivated* or
 * when no free subdivision is left.
 */
export function toggleLoop(index) {
  /* -------- turn off -------- */
  if (loops[index]) {
    loops[index].loop.dispose();
    loops[index] = null;
    return false;
  }

  /* -------- turn on -------- */
  const takenSubs = loops.filter(Boolean).map((l) => l.sub);
  const freeSub = subdivisions.find((s) => !takenSubs.includes(s));
  if (!freeSub) return false; // no spare slots

  const startTime = nextGridTime(freeSub);
  const loop = new Tone.Loop(() => play(index), freeSub).start(startTime);

  loops[index] = { loop, sub: freeSub };
  return true;
}
