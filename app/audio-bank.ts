"use client";

export const NO_DAMAGE_SOUND = "/sounds/no-4-minecraft-hit.mp3";
export const CLASSIC_HURT_SOUND = "/sounds/no-1-classic-hurt.mp3";
export const GUNSHOT_SOUND = "/sounds/no-extra-gunshot-jbudden.mp3";
export const FAHHHH_SOUND = "/sounds/no-2-fahhhh.mp3";
export const SANS_VOICE_SOUND = "/sounds/voice-sans.mp3";
export const YES_TADA_SOUND = "/sounds/yes-ta-da.mp3";
export const INTRO_BATTLE_SOUND = "/sounds/intro-pokemon-battle.mp3";
export const YOSHI_TONGUE_SOUND = "/sounds/no-5-yoshi-tongue.mp3";

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
  YOSHI_TONGUE_SOUND,
  WILL_EXIT_SOUND,
  INTRO_BATTLE_SOUND,
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

export type LoopingSound = {
  duck: (factor?: number, holdMs?: number, releaseMs?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

type LoopRegion = {
  start: number;
  end?: number;
};

export function playDecodedLoop(source: string, volume = .4, region?: LoopRegion): LoopingSound | null {
  const context = getAudioContext();
  const buffer = decodedBuffers.get(source);

  if (context && buffer) {
    const player = context.createBufferSource();
    const gain = context.createGain();
    let stopped = false;

    player.buffer = buffer;
    player.loop = true;
    player.loopStart = Math.max(0, region?.start ?? 0);
    if (region?.end && region.end > player.loopStart) {
      player.loopEnd = Math.min(region.end, buffer.duration);
    }
    gain.gain.value = volume;
    player.connect(gain).connect(context.destination);
    player.start(context.currentTime);

    const resume = () => {
      if (!stopped && context.state !== "running") void context.resume();
    };
    resume();

    return {
      duck: (factor = .3, holdMs = 260, releaseMs = 180) => {
        if (stopped) return;
        const now = context.currentTime;
        const duckedVolume = volume * Math.max(0, Math.min(1, factor));
        if (typeof gain.gain.cancelAndHoldAtTime === "function") {
          gain.gain.cancelAndHoldAtTime(now);
        } else {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
        }
        gain.gain.linearRampToValueAtTime(duckedVolume, now + .02);
        gain.gain.setValueAtTime(duckedVolume, now + holdMs / 1000);
        gain.gain.linearRampToValueAtTime(volume, now + (holdMs + releaseMs) / 1000);
      },
      pause: () => {
        if (!stopped && context.state === "running") void context.suspend();
      },
      resume,
      stop: () => {
        if (stopped) return;
        stopped = true;
        player.stop();
        player.disconnect();
        gain.disconnect();
      },
    };
  }

  const audio = fallbackAudio.get(source);
  if (!audio) return null;
  const player = audio.cloneNode(true) as HTMLAudioElement;
  const loopStart = Math.max(0, region?.start ?? 0);
  const loopEnd = region?.end;
  let stopped = false;
  let duckTimer: number | null = null;

  player.loop = !region;
  player.volume = volume;
  const resume = () => {
    if (!stopped) void player.play();
  };
  const restartLoop = () => {
    if (stopped) return;
    player.currentTime = loopStart;
    void player.play();
  };
  const enforceLoopEnd = () => {
    if (loopEnd && player.currentTime >= loopEnd) restartLoop();
  };

  if (region) {
    player.addEventListener("ended", restartLoop);
    if (loopEnd) player.addEventListener("timeupdate", enforceLoopEnd);
  }
  resume();

  return {
    duck: (factor = .3, holdMs = 260, releaseMs = 180) => {
      if (stopped) return;
      player.volume = volume * Math.max(0, Math.min(1, factor));
      if (duckTimer) window.clearTimeout(duckTimer);
      duckTimer = window.setTimeout(() => {
        player.volume = volume;
        duckTimer = null;
      }, holdMs + releaseMs);
    },
    pause: () => {
      if (!stopped) player.pause();
    },
    resume,
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (duckTimer) window.clearTimeout(duckTimer);
      player.pause();
      player.currentTime = 0;
      player.removeEventListener("ended", restartLoop);
      player.removeEventListener("timeupdate", enforceLoopEnd);
    },
  };
}
