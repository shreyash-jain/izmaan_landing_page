"use client";

import { useEffect, useState } from "react";

// ── Shared ambient-ocean engine (module-level singleton) ──────────────
// One AudioContext for the whole page; desktop + mobile buttons share it.
// Generative filtered "brown" noise = distant surf.
//
// Signal chain:  noise → lowpass → swell(gain, LFO-modulated) → master → out
// The level (off/low/full) rides the MASTER gain, which the LFO never
// touches — so "off" is genuinely silent and levels are exact.
//
// Levels:  land → LOW (20%);  tap → FULL (100%);  tap → OFF;  tap → LOW …

type Level = "off" | "low" | "full";
type Engine = { ctx: AudioContext; master: GainNode };

const FULL = 0.1; // "100%" — a comfortable full ambient level
const VOL: Record<Level, number> = {
  off: 0.0001,
  low: FULL * 0.2, // "20%"
  full: FULL,
};

let engine: Engine | null = null;
let level: Level = "off";
let userToggled = false; // once they tap, stop auto-starting
const subs = new Set<(l: Level) => void>();

function notify() {
  subs.forEach((f) => f(level));
}

function build(): Engine | null {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    const ctx: AudioContext = new Ctx();

    const size = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < size; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 480;
    lp.Q.value = 0.6;

    // gentle swell — LFO modulates THIS gain only (stays positive)
    const swell = ctx.createGain();
    swell.gain.value = 0.7;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);
    lfoGain.connect(swell.gain);

    const master = ctx.createGain(); // the true level control
    master.gain.value = 0.0001;

    noise.connect(lp);
    lp.connect(swell);
    swell.connect(master);
    master.connect(ctx.destination);
    noise.start();
    lfo.start();

    return { ctx, master };
  } catch {
    return null;
  }
}

async function setLevel(next: Level, dur: number) {
  if (!engine) engine = build();
  if (!engine) return;
  const { ctx, master } = engine;
  try {
    if (ctx.state === "suspended") await ctx.resume();
  } catch {}
  const t = ctx.currentTime;
  const cur = Math.max(0.0001, master.gain.value);
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(cur, t);
  master.gain.linearRampToValueAtTime(VOL[next], t + dur);
  level = next;
  notify();
}

// button cycle: low → full → off → low
function cycle() {
  userToggled = true;
  if (level === "low") setLevel("full", 1.1);
  else if (level === "full") setLevel("off", 0.5);
  else setLevel("low", 1.6);
}

// Browsers block audio before a gesture — fade LOW (20%) in on first interaction.
let autostartInstalled = false;
function installAutostart() {
  if (autostartInstalled || typeof window === "undefined") return;
  autostartInstalled = true;
  const evts = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"];
  const handler = (e: Event) => {
    const el = e.target as HTMLElement | null;
    if (el && el.closest && el.closest("[data-ambient]")) return; // button handles itself
    if (!userToggled && level === "off") setLevel("low", 2.4);
    evts.forEach((ev) => window.removeEventListener(ev, handler));
  };
  evts.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
}

// ── Button (desktop nav + mobile drawer share the engine) ──
export function AmbientSound({ compact = false }: { compact?: boolean }) {
  const [lvl, setLvl] = useState<Level>("off");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setLvl(level);
    const sub = (l: Level) => setLvl(l);
    subs.add(sub);
    installAutostart();
    return () => {
      subs.delete(sub);
    };
  }, []);

  if (!ready) return null;

  const active = lvl !== "off";
  const full = lvl === "full";
  const label =
    lvl === "off"
      ? "Ambient waves off — tap to play"
      : lvl === "low"
      ? "Ambient waves 20% — tap for full"
      : "Ambient waves 100% — tap to mute";

  const wave = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 13c2 0 2-1.6 4-1.6S9 13 11 13s2-1.6 4-1.6S17 13 19 13s2-1.6 2-1.6" />
      <path d="M3 17.5c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6" />
      {lvl === "off" && <path d="M4 4l16 16" stroke="currentColor" />}
    </svg>
  );

  if (compact) {
    return (
      <button
        type="button"
        data-ambient
        onClick={cycle}
        aria-label={label}
        title={label}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${
          active
            ? "border-teal/40 bg-teal/10 text-teal"
            : "border-teal/25 bg-white/60 text-deepsea/50 hover:border-teal hover:text-teal"
        }`}
      >
        {wave}
        {active && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal">
            {full && <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-ambient
      onClick={cycle}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-white/60 px-3.5 py-2 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-deepsea/70 transition hover:border-teal hover:text-teal"
    >
      <span className={active ? "text-teal" : ""}>{wave}</span>
      {lvl === "off" ? "Waves" : lvl === "low" ? "Waves 20%" : "Waves 100%"}
    </button>
  );
}
