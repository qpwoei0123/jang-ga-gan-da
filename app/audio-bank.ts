"use client";

export const NO_DAMAGE_SOUND = "/sounds/no-4-minecraft-hit.mp3";
export const CLASSIC_HURT_SOUND = "/sounds/no-1-classic-hurt.mp3";
export const GUNSHOT_SOUND = "/sounds/no-extra-gunshot-jbudden.mp3";
export const FAHHHH_SOUND = "/sounds/no-2-fahhhh.mp3";
export const SANS_VOICE_SOUND = "/sounds/voice-sans.mp3";
export const YES_TADA_SOUND = "/sounds/yes-ta-da.mp3";

export const NO_ATTEMPT_EXTRA_SOUNDS = [
  [],
  [[CLASSIC_HURT_SOUND, .9]],
  [[GUNSHOT_SOUND, .7]],
  [[FAHHHH_SOUND, .78]],
  [[GUNSHOT_SOUND, .63], [FAHHHH_SOUND, .72]],
] as const;

export const WILL_EXIT_SOUND = "/sounds/will-exit-get-out.mp3";
export const INTERACTION_SOUNDS = [
  NO_DAMAGE_SOUND,
  CLASSIC_HURT_SOUND,
  GUNSHOT_SOUND,
  FAHHHH_SOUND,
  SANS_VOICE_SOUND,
  YES_TADA_SOUND,
  WILL_EXIT_SOUND,
] as const;

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const decodedBuffers = new Map<string, AudioBuffer>();
const loadingSounds = new Map<string, Promise<void>>();
const fallbackAudio = new Map<string, HTMLAudioElement>();
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (audioContext) return audioContext;

  const AudioContextClass = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
  if (!AudioContextClass) return null;

  audioContext = new AudioContextClass();
  return audioContext;
}

function preloadFallback(source: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(source);
    const finish = () => {
      fallbackAudio.set(source, audio);
      resolve();
    };

    audio.preload = "auto";
    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("error", () => reject(new Error(source)), { once: true });
    audio.load();
  });
}

export function preloadSound(source: string) {
  if (decodedBuffers.has(source) || fallbackAudio.has(source)) return Promise.resolve();

  const pending = loadingSounds.get(source);
  if (pending) return pending;

  const promise = (async () => {
    const context = getAudioContext();
    if (!context) {
      await preloadFallback(source);
      return;
    }

    const response = await fetch(source, { cache: "force-cache" });
    if (!response.ok) throw new Error(source);

    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    decodedBuffers.set(source, buffer);
  })().finally(() => loadingSounds.delete(source));

  loadingSounds.set(source, promise);
  return promise;
}

export function playDecodedSound(source: string, volume = .8) {
  const context = getAudioContext();
  const buffer = decodedBuffers.get(source);

  if (context && buffer) {
    const player = context.createBufferSource();
    const gain = context.createGain();
    player.buffer = buffer;
    gain.gain.value = volume;
    player.connect(gain).connect(context.destination);
    player.start(context.currentTime);
    if (context.state !== "running") void context.resume();
    return;
  }

  const audio = fallbackAudio.get(source);
  if (!audio) return;
  const player = audio.cloneNode(true) as HTMLAudioElement;
  player.volume = volume;
  void player.play();
}
