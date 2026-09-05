export const PRINT_DURATION_MS = 2200;
export const PRINT_STAMP_MS = 350;

type Scheduler = {
  request: (callback: (time: number) => void) => number;
  cancel: (id: number) => void;
  delay: (callback: () => void, milliseconds: number) => number;
  clear: (id: number) => void;
};

export function getPrintTarget(complete: number, total: number, resourcesReady: boolean) {
  return resourcesReady ? 1 : Math.max(0, Math.min(complete, total)) / (Math.max(0, total) + 1);
}

export function createPrintSequence({ onProgress, onComplete, reducedMotion = false, scheduler }: {
  onProgress: (progress: number) => void;
  onComplete: () => void;
  reducedMotion?: boolean;
  scheduler?: Scheduler;
}) {
  const clock = scheduler ?? {
    request: (callback: (time: number) => void) => window.requestAnimationFrame(callback),
    cancel: (id: number) => window.cancelAnimationFrame(id),
    delay: (callback: () => void, milliseconds: number) => window.setTimeout(callback, milliseconds),
    clear: (id: number) => window.clearTimeout(id),
  };
  let progress = 0;
  let target = 0;
  let frame: number | undefined;
  let stamp: number | undefined;
  let lastTime: number | undefined;
  let disposed = false;
  let completed = false;

  const tick = (time: number) => {
    frame = undefined;
    if (disposed || completed) return;
    const elapsed = lastTime === undefined ? 16 : Math.min(Math.max(0, time - lastTime), 64);
    lastTime = time;
    progress = reducedMotion ? target : Math.min(target, progress + elapsed / PRINT_DURATION_MS);
    onProgress(progress);
    if (progress < target) {
      frame = clock.request(tick);
    } else {
      lastTime = undefined;
      if (progress === 1 && stamp === undefined) {
        stamp = clock.delay(() => {
          stamp = undefined;
          if (disposed || completed || progress !== 1) return;
          completed = true;
          onComplete();
        }, reducedMotion ? 0 : PRINT_STAMP_MS);
      }
    }
  };

  return {
    setTarget(next: number) {
      if (disposed || completed) return;
      target = Math.max(0, Math.min(1, next));
      if (target < progress) {
        progress = target;
        if (stamp !== undefined) clock.clear(stamp);
        stamp = undefined;
      }
      if (frame === undefined && stamp === undefined) frame = clock.request(tick);
    },
    dispose() {
      disposed = true;
      if (frame !== undefined) clock.cancel(frame);
      if (stamp !== undefined) clock.clear(stamp);
    },
  };
}
