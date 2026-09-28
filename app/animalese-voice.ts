"use client";

// A small, original formant synthesizer. Korean vowels shape each syllable;
// consonants add a brief transient. No recorded game audio is used.
export type VoiceStyle = "peppy" | "normal" | "lazy";

const voices: Record<VoiceStyle, { pitch: number; speed: number; variance: number; gain: number }> = {
  peppy: { pitch: 1.4, speed: 1.3, variance: .075, gain: .16 },
  normal: { pitch: 1, speed: 1, variance: .04, gain: .18 },
  lazy: { pitch: .8, speed: .8, variance: .025, gain: .2 },
};

// Approximate first and second vowel resonances for the 21 Hangul medials.
const vowels: [number, number][] = [
  [800, 1500], [700, 1750], [800, 1550], [700, 1800], [620, 1100],
  [500, 1850], [620, 1150], [500, 1900], [450, 900], [700, 1300],
  [650, 1650], [480, 1900], [450, 950], [350, 950], [590, 1100],
  [500, 1650], [350, 2000], [350, 1000], [400, 1200], [400, 1650], [300, 2300],
];

const noisyInitials = new Set([0, 1, 3, 4, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18]);
const noiseBuffers = new WeakMap<AudioContext, AudioBuffer>();

function noiseBuffer(context: AudioContext) {
  let buffer = noiseBuffers.get(context);
  if (buffer) return buffer;
  buffer = context.createBuffer(1, Math.ceil(context.sampleRate * .08), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  noiseBuffers.set(context, buffer);
  return buffer;
}

export function syllableDelay(letter: string, style: VoiceStyle) {
  const base = /[!~.,?\n]/.test(letter) ? 170 : /\s/.test(letter) ? 95 : 78;
  return base / voices[style].speed;
}

export function speakSyllable(context: AudioContext, letter: string, style: VoiceStyle, position: number) {
  if (context.state !== "running" || !/[가-힣a-z0-9]/i.test(letter)) return;

  const voice = voices[style];
  const code = letter.charCodeAt(0);
  const hangul = code >= 0xac00 && code <= 0xd7a3;
  const syllable = code - 0xac00;
  const initial = hangul ? Math.floor(syllable / 588) : -1;
  const medial = hangul ? Math.floor((syllable % 588) / 28) : 0;
  const [f1, f2] = vowels[medial];
  const now = context.currentTime;
  const duration = Math.min(.11, syllableDelay(letter, style) / 1000 * .9);
  const pitch = 300 * voice.pitch * (1 + (((position * 7 + code) % 9) - 4) / 4 * voice.variance);

  const source = context.createOscillator();
  source.type = "sawtooth";
  source.frequency.setValueAtTime(pitch * 1.04, now);
  source.frequency.exponentialRampToValueAtTime(pitch * .96, now + duration);

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(.001, now);
  envelope.gain.linearRampToValueAtTime(voice.gain, now + .012);
  envelope.gain.setValueAtTime(voice.gain * .8, now + duration * .55);
  envelope.gain.exponentialRampToValueAtTime(.001, now + duration);

  const filters = [
    [f1, 3.5, 1], [f2, 5, .65], [2700, 7, .2],
  ].map(([frequency, q, level]) => {
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    gain.gain.value = level;
    source.connect(filter).connect(gain).connect(envelope);
    return { filter, gain };
  });
  envelope.connect(context.destination);
  source.onended = () => {
    source.disconnect();
    filters.forEach(({ filter, gain }) => { filter.disconnect(); gain.disconnect(); });
    envelope.disconnect();
  };
  source.start(now);
  source.stop(now + duration + .002);

  if (noisyInitials.has(initial)) {
    const burst = context.createBufferSource();
    const highpass = context.createBiquadFilter();
    const burstGain = context.createGain();
    burst.buffer = noiseBuffer(context);
    highpass.type = "highpass";
    highpass.frequency.value = initial === 9 || initial === 10 ? 2600 : 1500;
    burstGain.gain.setValueAtTime(.001, now);
    burstGain.gain.linearRampToValueAtTime(.018, now + .003);
    burstGain.gain.exponentialRampToValueAtTime(.001, now + .018);
    burst.connect(highpass).connect(burstGain).connect(context.destination);
    burst.onended = () => { burst.disconnect(); highpass.disconnect(); burstGain.disconnect(); };
    burst.start(now);
    burst.stop(now + .02);
  }
}
