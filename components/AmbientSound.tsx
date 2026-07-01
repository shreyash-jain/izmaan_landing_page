"use client";

import { useEffect, useRef, useState } from "react";

// Generative ambient ocean — filtered, slowly-modulated noise that reads as
// distant surf. No audio file to download; starts only on user toggle (browsers
// block autoplay), and fades in/out gently.
export function AmbientSound({ compact = false }: { compact?: boolean }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        try {
          ctxRef.current.close();
        } catch {}
      }
    };
  }, []);

  function build() {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const size = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < size; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; // brown-ish noise → surf wash
      data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 540;
    lp.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.value = 0.0001;

    // slow swell of the waves
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.11;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.022;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    noise.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    lfo.start();

    ctxRef.current = ctx;
    gainRef.current = gain;
  }

  function toggle() {
    try {
      if (!ctxRef.current) build();
      const ctx = ctxRef.current!;
      const gain = gainRef.current!;
      if (ctx.state === "suspended") ctx.resume();
      const next = !on;
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), t);
      gain.gain.linearRampToValueAtTime(next ? 0.06 : 0.0001, t + (next ? 1.6 : 0.8));
      setOn(next);
    } catch {
      setOn((v) => !v);
    }
  }

  if (!ready) return null;

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
    </svg>
  );

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Turn ambient waves off" : "Play ambient waves"}
        title={on ? "Ambient waves on" : "Play ambient waves"}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${
          on
            ? "border-teal/40 bg-teal/10 text-teal"
            : "border-teal/25 bg-white/60 text-deepsea/60 hover:border-teal hover:text-teal"
        }`}
      >
        {wave}
        {on && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal">
            <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title={on ? "Ambient waves on" : "Play ambient waves"}
      className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-white/60 px-3.5 py-2 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-deepsea/70 transition hover:border-teal hover:text-teal"
    >
      <span className={on ? "text-teal" : ""}>{wave}</span>
      {on ? "Waves on" : "Waves"}
    </button>
  );
}
