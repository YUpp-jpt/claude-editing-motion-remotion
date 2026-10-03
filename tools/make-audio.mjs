/**
 * Original deterministic soundtrack for the 30-second editing animation.
 * No reference recording, commercial sample, or third-party music is used.
 * Run: node tools/make-audio.mjs
 * Adjust EVENT_TIMES below when editing the visual timeline.
 */
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public', 'audio', 'recreated.wav');
const SAMPLE_RATE = 48_000;
const DURATION = 30;
const BPM = 120;
const BEAT = 60 / BPM;
const COUNT = SAMPLE_RATE * DURATION;
const left = new Float32Array(COUNT);
const right = new Float32Array(COUNT);
const TAU = Math.PI * 2;

// Seconds in the composition, deliberately independent of the render clock.
export const EVENT_TIMES = {
  expand: 0.66,
  interfaceBuild: [0.9, 1.1, 1.35, 1.55],
  mascotLanding: 1.88,
  clipDrops: [2.48, 3.05, 3.5, 3.95],
  musicDrop: 4.37,
  brushSweeps: [6.5, 6.93],
  trashImpact: 7.4,
  transitions: [9.6, 10.95, 11.62],
  titleDrop: 12.35,
  undo: 14.2,
  correction: 14.75,
  flashSlider: [15.95, 16.63],
  saturationOverload: [17.1, 18.35],
  saturationReset: 18.45,
  rhythmSlider: 19.5,
  beatMarkers: [20.35, 21.25],
  beatSnap: 21.68,
  exportClick: 24,
  exportWaiting: [24.6, 25.65],
  bonk: 25.7,
  exportComplete: 26,
  finalPhone: 26.65,
  finalTitle: 28.55,
  finalNote: 29.3,
};

let seed = 0x5a17c3d9;
function noise() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 2_147_483_648 - 1;
}

function voice(start, duration, amplitude, pan, synth) {
  const first = Math.round(start * SAMPLE_RATE);
  const length = Math.min(Math.round(duration * SAMPLE_RATE), COUNT - first);
  const l = Math.sqrt((1 - pan) / 2) * amplitude;
  const r = Math.sqrt((1 + pan) / 2) * amplitude;
  for (let i = 0; i < length; i++) {
    const value = synth(i / SAMPLE_RATE, duration, i);
    if (first + i >= 0) {
      left[first + i] += value * l;
      right[first + i] += value * r;
    }
  }
}

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
function release(t, duration, seconds = 0.025) {
  return Math.min(1, Math.max(0, (duration - t) / seconds));
}
function pluck(start, note, amplitude = 0.18, pan = 0, duration = 0.75) {
  const f = hz(note);
  voice(start, duration, amplitude, pan, (t, d) => {
    const attack = Math.min(1, t / 0.0025);
    const fundamental = Math.sin(TAU * f * t) * Math.exp(-t * 5.4);
    const bell = Math.sin(TAU * f * 2.756 * t) * Math.exp(-t * 14.5) * 0.2;
    const octave = Math.sin(TAU * f * 2 * t) * Math.exp(-t * 9) * 0.24;
    return (fundamental + bell + octave) * attack * release(t, d);
  });
}
function bass(start, note, duration = 0.35, amplitude = 0.145) {
  const f = hz(note);
  voice(start, duration, amplitude, 0, (t, d) =>
    (Math.sin(TAU * f * t) + 0.16 * Math.sin(TAU * f * 2 * t)) *
    Math.min(1, t / 0.006) * Math.exp(-t * 3.2) * release(t, d, 0.055));
}
function pad(start, notes, duration, amplitude = 0.022) {
  notes.forEach((note, index) => {
    const f = hz(note);
    voice(start, duration, amplitude, (index - 1.5) * 0.16, (t, d) =>
      (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 1.002 * t)) *
      Math.min(1, t / 0.09) * release(t, d, 0.18));
  });
}
function kick(start, amplitude = 0.245) {
  voice(start, 0.25, amplitude, 0, (t, d) => {
    const phase = TAU * (48 * t + 2.45 * (1 - Math.exp(-t / 0.022)));
    return (Math.sin(phase) * Math.exp(-t * 17) + noise() * Math.exp(-t * 450) * 0.12) *
      Math.min(1, t / 0.0006) * release(t, d);
  });
}
function snare(start, amplitude = 0.095) {
  let prev = 0;
  voice(start, 0.14, amplitude, -0.07, (t, d) => {
    const n = noise();
    const bright = n - prev * 0.75;
    prev = n;
    return (bright * Math.exp(-t * 32) + Math.sin(TAU * 178 * t) * Math.exp(-t * 45) * 0.28) *
      Math.min(1, t / 0.001) * release(t, d);
  });
}
function hat(start, amplitude = 0.025, pan = 0.3, open = false) {
  let prev = 0;
  voice(start, open ? 0.2 : 0.065, amplitude, pan, (t, d) => {
    const n = noise();
    const high = n - prev;
    prev = n;
    return high * Math.exp(-t * (open ? 22 : 75)) * Math.min(1, t / 0.001) * release(t, d);
  });
}
function click(start, pitch = 900, amplitude = 0.16, pan = 0) {
  voice(start, 0.052, amplitude, pan, (t, d) =>
    (Math.sin(TAU * pitch * t) * 0.65 + noise() * 0.18) *
    Math.exp(-t * 100) * Math.min(1, t / 0.0007) * release(t, d));
}
function pop(start, from = 480, to = 170, amplitude = 0.27, pan = 0) {
  voice(start, 0.17, amplitude, pan, (t, d) => {
    const phase = TAU * (to * t + (from - to) * 0.027 * (1 - Math.exp(-t / 0.027)));
    return Math.sin(phase) * Math.exp(-t * 22) * Math.min(1, t / 0.001) * release(t, d);
  });
}
function glide(start, duration, from, to, amplitude = 0.11, pan = 0) {
  voice(start, duration, amplitude, pan, (t, d) =>
    Math.sin(TAU * (from * t + (to - from) * t * t / (2 * d))) *
    Math.sin(Math.PI * t / d) ** 0.65);
}
function whoosh(start, duration = 0.28, amplitude = 0.085, pan = 0) {
  let smooth = 0;
  voice(start, duration, amplitude, pan, (t, d) => {
    const n = noise();
    smooth = smooth * 0.87 + n * 0.13;
    return (n * 0.14 + smooth * 1.9) * Math.sin(Math.PI * t / d) ** 1.4;
  });
}
function bonk(start, amplitude = 0.4) {
  voice(start, 0.31, amplitude, 0.08, (t, d) =>
    (Math.sin(TAU * 145 * t) * Math.exp(-t * 16) +
      Math.sin(TAU * 308 * t) * Math.exp(-t * 27) * 0.52 +
      noise() * Math.exp(-t * 240) * 0.23) *
    Math.min(1, t / 0.0005) * release(t, d));
}
function sparkle(start, amplitude = 0.1, pan = 0.2) {
  [86, 90, 93].forEach((note, i) => pluck(start + i * 0.038, note, amplitude, pan - i * 0.15, 0.62));
}
function glitch(start, duration = 0.13, amplitude = 0.16) {
  let held = 0;
  voice(start, duration, amplitude, -0.1, (t, d, i) => {
    if (i % 35 === 0) held = noise();
    const gate = Math.sin(TAU * 37 * t) > -0.15 ? 1 : 0;
    return (held * 0.6 + Math.sign(Math.sin(TAU * 220 * t)) * 0.28) * gate * release(t, d, 0.015);
  });
}

// Original four-bar melody. The rests and syncopations keep UI impacts clear.
const chords = [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 69]];
const roots = [38, 35, 31, 33];
const melody = [
  [[0, 74], [0.75, 78], [1.5, 81], [2.5, 78], [3.25, 76]],
  [[0.25, 78], [1, 74], [1.75, 73], [2.5, 74], [3.5, 78]],
  [[0, 79], [0.75, 78], [1.5, 74], [2.25, 71], [3.25, 74]],
  [[0.25, 76], [1, 73], [1.75, 69], [2.5, 73], [3.5, 74]],
];
for (let bar = 0; bar < 15; bar++) {
  const start = bar * 4 * BEAT;
  const section = bar % 4;
  const level = bar === 0 ? 0.35 : bar === 14 ? 0.8 : 1;
  pad(start + 0.08, chords[section], 1.72, 0.023 * level);
  for (let beat = 0; beat < 4; beat++) {
    const t = start + beat * BEAT;
    if (t >= 0.72 && t < 29.25) {
      kick(t, 0.225 * level);
      if (beat % 2 === 1) snare(t, 0.09 * level);
      bass(t + 0.02, roots[section], 0.34, 0.143 * level);
      if (beat === 2) bass(t + 0.375, roots[section] + 7, 0.2, 0.105 * level);
      hat(t + 0.25, 0.025 * level, beat % 2 === 0 ? 0.3 : -0.25, beat === 3);
    }
  }
  melody[section].forEach(([beat, note], i) => {
    const t = start + beat * BEAT;
    if (t > 0.7 && t < 29.2) {
      pluck(t, note + (bar >= 8 && bar < 12 ? 12 : 0), 0.177 * level,
        Math.sin(i * 1.3 + bar) * 0.21, 0.78);
    }
  });
}

// UI Foley: original synthesized contact sounds, airy drags, and cartoon accents.
[0.03, 0.085, 0.125, 0.18, 0.25, 0.29, 0.35, 0.4, 0.45, 0.52, 0.57].forEach((t, i) =>
  click(t, 510 + i % 3 * 170, 0.088, -0.08));
whoosh(EVENT_TIMES.expand, 0.38, 0.12, -0.35);
glide(0.66, 0.3, 400, 1300, 0.08, -0.3);
EVENT_TIMES.interfaceBuild.forEach((t, i) => click(t, 730 + i * 150, 0.12, (i - 1.5) * 0.16));
pop(EVENT_TIMES.mascotLanding, 330, 105, 0.26, -0.35);
EVENT_TIMES.clipDrops.forEach((t, i) => {
  whoosh(t - 0.23, 0.22, 0.075, -0.3 + i * 0.16);
  pop(t, 460 + i * 70, 220 + i * 20, 0.25, -0.3 + i * 0.16);
  pluck(t + 0.024, [74, 78, 81, 83][i], 0.1, 0.1, 0.35);
});
whoosh(4.16, 0.24, 0.07, -0.3);
click(EVENT_TIMES.musicDrop, 670, 0.15, -0.12);
EVENT_TIMES.brushSweeps.forEach((t) => whoosh(t - 0.09, 0.2, 0.15, -0.15));
glide(7.11, 0.24, 690, 180, 0.105, -0.2);
bonk(EVENT_TIMES.trashImpact, 0.34);
click(8.54, 930, 0.16, -0.35);
whoosh(9.2, 0.25, 0.085, -0.22);
glide(EVENT_TIMES.transitions[0] - 0.06, 0.35, 500, 1400, 0.12, -0.08);
whoosh(EVENT_TIMES.transitions[1] - 0.12, 0.3, 0.14, 0.15);
click(10.75, 720, 0.115, -0.08);
glitch(EVENT_TIMES.transitions[2]);
click(12.08, 1150, 0.13, -0.28);
whoosh(12.18, 0.22, 0.09, -0.16);
pop(EVENT_TIMES.titleDrop, 610, 320, 0.22, -0.1);
[12.55, 12.7, 12.87, 13.03, 13.2, 13.32].forEach((t, i) => click(t, 780 + i * 70, 0.095));
click(EVENT_TIMES.undo, 630, 0.23, -0.15);
glide(EVENT_TIMES.undo + 0.06, 0.2, 1200, 480, 0.13, -0.05);
pop(EVENT_TIMES.correction, 630, 340, 0.22, 0.3);
glide(EVENT_TIMES.flashSlider[0], 0.63, 460, 980, 0.06, 0.35);
sparkle(EVENT_TIMES.flashSlider[1], 0.105, 0.28);
glide(16.81, 0.29, 650, 1250, 0.1, 0.35);
glitch(EVENT_TIMES.saturationOverload[0], 0.19, 0.14);
glide(17.16, 0.17, 880, 1760, 0.085, 0.28);
glide(EVENT_TIMES.saturationReset - 0.09, 0.24, 1450, 620, 0.095, 0.3);
click(EVENT_TIMES.saturationReset + 0.17, 920, 0.11, 0.28);
glide(18.88, 0.62, 360, 730, 0.07, 0.3);
click(EVENT_TIMES.rhythmSlider, 880, 0.12, 0.32);
for (let i = 0; i < 14; i++) {
  const t = EVENT_TIMES.beatMarkers[0] + i * 0.064;
  click(t, 1100 + i % 4 * 105, 0.066, -0.25 + i / 28);
}
pop(EVENT_TIMES.beatSnap, 850, 450, 0.21, 0.1);
click(EVENT_TIMES.exportClick, 1120, 0.21, 0.3);
whoosh(EVENT_TIMES.exportClick + 0.03, 0.29, 0.07, 0.2);
[24.1, 24.22, 24.34, 24.48, 24.6].forEach((t, i) => pluck(t, 78 + i * 2, 0.075, 0.25, 0.36));
[24.88, 25.2, 25.52].forEach((t) => click(t, 570, 0.045, 0.25));
bonk(EVENT_TIMES.bonk, 0.46);
glide(EVENT_TIMES.bonk + 0.02, 0.12, 210, 90, 0.1, 0.14);
[74, 78, 81, 86].forEach((note, i) => pluck(EVENT_TIMES.exportComplete + i * 0.058,
  note, 0.17, -0.2 + i * 0.12, 1.1));
sparkle(26.15, 0.08, 0.35);
whoosh(EVENT_TIMES.finalPhone, 0.36, 0.1, 0.05);
[27.18, 27.31, 27.45, 27.62, 27.81, 28.12, 28.25, 28.38, 28.48].forEach((t, i) =>
  click(t, 520 + i % 3 * 100, 0.075, -0.25));
sparkle(EVENT_TIMES.finalTitle, 0.115, 0.18);
[74, 78, 81].forEach((note, i) => pluck(EVENT_TIMES.finalNote + i * 0.055, note, 0.17, i * 0.1 - 0.1, 0.7));

// Small stereo room. Read dry copies so delay does not depend on processing order.
const dryLeft = left.slice();
const dryRight = right.slice();
for (const [seconds, gain] of [[0.083, 0.075], [0.157, 0.06], [0.241, 0.035]]) {
  const delay = Math.round(seconds * SAMPLE_RATE);
  for (let i = delay; i < COUNT; i++) {
    left[i] += dryRight[i - delay] * gain;
    right[i] += dryLeft[i - delay] * gain;
  }
}

// Gentle saturation rounds simultaneous drum/foley transients. Final sample peak
// is -2.65 dBFS, leaving headroom for AAC encoding and later volume adjustments.
let peak = 0;
for (let i = 0; i < COUNT; i++) {
  const fadeIn = Math.min(1, i / (SAMPLE_RATE * 0.01));
  const fadeOut = Math.min(1, (COUNT - 1 - i) / (SAMPLE_RATE * 0.16));
  left[i] = Math.tanh(left[i] * 1.35) / 1.35 * fadeIn * fadeOut;
  right[i] = Math.tanh(right[i] * 1.35) / 1.35 * fadeIn * fadeOut;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const scale = 0.737 / peak;
const pcmBytes = COUNT * 4;
const wav = Buffer.alloc(44 + pcmBytes);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + pcmBytes, 4);
wav.write('WAVE', 8);
wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SAMPLE_RATE, 24);
wav.writeUInt32LE(SAMPLE_RATE * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(pcmBytes, 40);
let sumSquares = 0;
for (let i = 0; i < COUNT; i++) {
  const l = Math.round(left[i] * scale * 32767);
  const r = Math.round(right[i] * scale * 32767);
  wav.writeInt16LE(l, 44 + i * 4);
  wav.writeInt16LE(r, 46 + i * 4);
  sumSquares += (l / 32767) ** 2 + (r / 32767) ** 2;
}
await mkdir(path.dirname(output), {recursive: true});
await writeFile(output, wav);
console.log(JSON.stringify({
  output: 'public/audio/recreated.wav',
  sampleRate: SAMPLE_RATE,
  duration: DURATION,
  channels: 2,
  peakDbFS: 20 * Math.log10(0.737),
  rmsDbFS: 20 * Math.log10(Math.sqrt(sumSquares / (COUNT * 2))),
  source: 'Original deterministic synthesis; no reference audio included.',
}, null, 2));
